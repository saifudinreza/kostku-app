<?php

namespace App\Mail;

use App\Models\Invoice;
use App\Models\Tenancy;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Tenancy $tenancy,
        public Invoice $invoice,
        public int $daysUntilDue,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pengingat Tagihan KostKu — Jatuh Tempo {$this->daysUntilDue} Hari Lagi",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.invoice_reminder',
        );
    }
}
