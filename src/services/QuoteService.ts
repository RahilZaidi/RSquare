// services/QuoteService.ts
import { DesignProject, QuoteRequest, ProductConfig } from '../types';

export class QuoteService {
  static generateQuoteMessage(project: DesignProject): string {
    const products = project.products.map(product => {
      const price = ProductService.calculateProductPrice(
        product.templateId,
        product.color,
        product.size,
        product.quantity
      );
      return `• ${product.name} (${product.color}, ${product.size}) - Qty: ${product.quantity} - $${price.toFixed(2)}`;
    }).join('\n');

    const total = project.products.reduce((sum, product) => {
      return sum + ProductService.calculateProductPrice(
        product.templateId,
        product.color,
        product.size,
        product.quantity
      );
    }, 0);

    return `Hello! I'd like a quote for custom merchandise:

PROJECT: ${project.name}
${project.description ? `DESCRIPTION: ${project.description}\n` : ''}
PRODUCTS:
${products}

ESTIMATED TOTAL: $${total.toFixed(2)}

I have uploaded ${project.assets.length} design file(s). Please provide a detailed quote with delivery timeframe.

Thank you!`;
  }

  static async requestQuote(project: DesignProject): Promise<void> {
    const message = this.generateQuoteMessage(project);
    const phoneNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "+1234567890";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    
    // Update project metadata
    project.metadata.quoteRequestCount += 1;
    project.status = 'quoted';
    
    window.open(whatsappUrl, '_blank');
  }

  static calculateProjectTotal(project: DesignProject): number {
    return project.products.reduce((total, product) => {
      return total + ProductService.calculateProductPrice(
        product.templateId,
        product.color,
        product.size,
        product.quantity
      );
    }, 0);
  }
}