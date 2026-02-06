import { useRef } from 'react';
import { CartItem, Customer, PaymentMethod } from '@/types/pos';

interface ReceiptConfig {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  gstNumber?: string;
  logoUrl?: string;
  footerText?: string;
}

interface ThermalReceiptProps {
  transactionId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: PaymentMethod;
  customer?: Customer;
  config?: Partial<ReceiptConfig>;
  format?: 'thermal' | 'a4';
}

const defaultConfig: ReceiptConfig = {
  businessName: 'NexusPOS Store',
  businessAddress: '123 Market Street, Suite 100',
  businessPhone: '+1 (555) 123-4567',
  businessEmail: 'hello@nexuspos.com',
  gstNumber: 'GST12345678',
  footerText: 'Thank you for shopping with us!',
};

const paymentLabels: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'Card',
  upi: 'UPI',
  wallet: 'Wallet',
  split: 'Split Payment',
  credit: 'Credit',
};

export const printReceipt = (elementId: string, format: 'thermal' | 'a4' = 'thermal') => {
  const content = document.getElementById(elementId);
  if (!content) return;

  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) return;

  const width = format === 'thermal' ? '80mm' : '210mm';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt</title>
      <style>
        @page { size: ${width} auto; margin: 0; }
        body {
          font-family: 'Courier New', monospace;
          margin: 0;
          padding: ${format === 'thermal' ? '4mm' : '15mm'};
          width: ${width};
          font-size: ${format === 'thermal' ? '11px' : '13px'};
          color: #000;
          background: #fff;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .separator { border-top: 1px dashed #000; margin: 6px 0; }
        .double-separator { border-top: 2px solid #000; margin: 6px 0; }
        .row { display: flex; justify-content: space-between; line-height: 1.6; }
        .item-name { flex: 1; padding-right: 8px; }
        .total-row { font-size: ${format === 'thermal' ? '16px' : '18px'}; font-weight: bold; }
        .business-name { font-size: ${format === 'thermal' ? '18px' : '22px'}; font-weight: bold; }
        .logo { max-width: 60px; max-height: 60px; margin: 0 auto 4px; display: block; }
        .footer { margin-top: 12px; font-size: 10px; }
        @media print { body { -webkit-print-color-adjust: exact; } }
      </style>
    </head>
    <body>${content.innerHTML}</body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

export const ThermalReceipt = ({
  transactionId,
  items,
  subtotal,
  tax,
  discount,
  total,
  amountPaid,
  change,
  paymentMethod,
  customer,
  config: userConfig,
  format = 'thermal',
}: ThermalReceiptProps) => {
  const cfg = { ...defaultConfig, ...userConfig };
  const now = new Date();

  return (
    <div
      id="receipt-printable"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        width: format === 'thermal' ? '80mm' : '210mm',
        fontFamily: "'Courier New', monospace",
        fontSize: format === 'thermal' ? '11px' : '13px',
        color: '#000',
        background: '#fff',
        padding: format === 'thermal' ? '4mm' : '15mm',
      }}
    >
      {/* Header */}
      <div className="text-center" style={{ textAlign: 'center', marginBottom: 8 }}>
        {cfg.logoUrl && (
          <img src={cfg.logoUrl} alt="Logo" style={{ maxWidth: 60, maxHeight: 60, margin: '0 auto 4px', display: 'block' }} />
        )}
        <div style={{ fontSize: format === 'thermal' ? 18 : 22, fontWeight: 'bold' }}>{cfg.businessName}</div>
        <div>{cfg.businessAddress}</div>
        <div>Tel: {cfg.businessPhone}</div>
        {cfg.gstNumber && <div>GST: {cfg.gstNumber}</div>}
      </div>

      <div style={{ borderTop: '2px solid #000', margin: '6px 0' }} />

      {/* Transaction Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6 }}>
        <span>Invoice #:</span>
        <span style={{ fontWeight: 'bold' }}>{transactionId}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6 }}>
        <span>Date:</span>
        <span>{now.toLocaleDateString()}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6 }}>
        <span>Time:</span>
        <span>{now.toLocaleTimeString()}</span>
      </div>
      {customer && (
        <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6 }}>
          <span>Customer:</span>
          <span>{customer.name}</span>
        </div>
      )}

      <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

      {/* Items */}
      {items.map((item) => (
        <div key={item.product.id}>
          <div style={{ fontWeight: 'bold' }}>{item.product.name}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6 }}>
            <span>&nbsp;&nbsp;{item.quantity} × ${item.product.price.toFixed(2)}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
          {item.discount && item.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6, fontSize: '10px' }}>
              <span>&nbsp;&nbsp;Discount</span>
              <span>-${item.discount.toFixed(2)}</span>
            </div>
          )}
        </div>
      ))}

      <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6 }}>
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6 }}>
        <span>Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6 }}>
          <span>Discount</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
      )}
      <div style={{ borderTop: '2px solid #000', margin: '6px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6, fontSize: format === 'thermal' ? 16 : 18, fontWeight: 'bold' }}>
        <span>TOTAL</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6 }}>
        <span>Payment</span>
        <span>{paymentLabels[paymentMethod]}</span>
      </div>
      {paymentMethod === 'cash' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6 }}>
            <span>Paid</span>
            <span>${amountPaid.toFixed(2)}</span>
          </div>
          {change > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.6, fontWeight: 'bold' }}>
              <span>Change</span>
              <span>${change.toFixed(2)}</span>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 10, marginTop: 8 }}>
        {cfg.footerText && <div>{cfg.footerText}</div>}
        <div style={{ marginTop: 4 }}>Powered by NexusPOS</div>
      </div>
    </div>
  );
};
