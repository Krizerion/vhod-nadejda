import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Apartment } from '../data/interfaces';
import { MonthYearPipe } from '../shared/pipes/month-year.pipe';
import { TippyDirective } from '../shared/directives/tippy.directive';

interface DialogData {
  apartment: Apartment;
  floorNumber: number;
}

@Component({
  selector: 'vn-apartment-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MonthYearPipe,
    TippyDirective,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>home</mat-icon>
      Апартамент {{ data.apartment.number }}
    </h2>
    <mat-dialog-content>
      <div class="details-container">
        <div class="detail-item">
          <mat-icon class="detail-icon">people</mat-icon>
          <div class="detail-content">
            <span class="detail-label">Брой живущи</span>
            <span class="detail-value">{{
              data.apartment.residentsCount || 'Няма данни'
            }}</span>
          </div>
        </div>

        <div class="detail-item">
          <mat-icon class="detail-icon">payments</mat-icon>
          <div class="detail-content">
            <div class="label-with-info">
              <span class="detail-label">Месечна такса</span>
              <mat-icon
                class="info-icon"
                [vnTippy]="getMonthlyFeeTooltipHtml()"
                [tippyOptions]="{
                  placement: 'top',
                  allowHTML: true,
                  theme: 'fee-tooltip',
                  zIndex: 10000
                }"
              >
                info
              </mat-icon>
            </div>
            <span class="detail-value">
              {{
                getMonthlyFee()
                  ? '€' + (getMonthlyFee() | number : '1.2-2')
                  : 'Няма данни'
              }}
            </span>
          </div>
        </div>

        <div class="detail-item">
          <mat-icon
            class="detail-icon"
            [class.warning]="
              data.apartment.totalDebt && data.apartment.totalDebt > 0
            "
          >
            account_balance_wallet
          </mat-icon>
          <div class="detail-content">
            <span class="detail-label">Дължими суми до момента</span>
            <span
              class="detail-value"
              [class.debt]="
                data.apartment.totalDebt && data.apartment.totalDebt > 0
              "
            >
              {{
                data.apartment.totalDebt
                  ? '€' + (data.apartment.totalDebt | number : '1.2-2')
                  : 'Няма данни'
              }}
            </span>
          </div>
        </div>

        <div class="detail-item">
          <mat-icon class="detail-icon">calendar_today</mat-icon>
          <div class="detail-content">
            <span class="detail-label">Платено до</span>
            <span class="detail-value">
              {{ data.apartment.lastPaymentDate | monthYear }}
            </span>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Затвори</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      h2[mat-dialog-title] {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        padding: 24px 24px 16px;
        font-size: 1.5rem;
        font-weight: 500;
      }

      mat-dialog-content {
        padding: 0 24px;
        min-width: 400px;

        @media (max-width: 600px) {
          min-width: auto;
        }
      }

      .details-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 16px 0;
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
      }

      .detail-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: var(--mat-primary-color);

        &.warning {
          color: var(--mat-warn-color);
        }
      }

      .detail-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .label-with-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .info-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: rgba(0, 0, 0, 0.54);
        cursor: help;
        transition: color 0.2s ease;

        &:hover {
          color: var(--mat-primary-color);
        }
      }

      .detail-label {
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
      }

      .detail-value {
        font-size: 1.25rem;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.87);

        &.debt {
          color: var(--mat-warn-color);
        }
      }

      mat-dialog-actions {
        padding: 16px 24px;
        margin: 0;
      }
    `,
  ],
})
export class ApartmentDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  getMonthlyFee(): number {
    const apartment = this.data.apartment;
    const repairsFee = apartment.repairsFee || 0;
    const currentExpensesFee = apartment.currentExpensesFee || 0;
    return repairsFee + currentExpensesFee;
  }

  getMonthlyFeeTooltipHtml(): string {
    const apartment = this.data.apartment;
    const repairsFee = apartment.repairsFee || 0;
    const currentExpensesFee = apartment.currentExpensesFee || 0;
    const totalFee = this.getMonthlyFee();
    const residentsCount = apartment.residentsCount || 0;
    const floorNumber = this.data.floorNumber;

    return `
      <div class="fee-tooltip-content">
        <div class="fee-tooltip-header">
          Месечна такса: <strong>€${totalFee.toFixed(2)}</strong>
        </div>
        <div class="fee-tooltip-divider"></div>
        <div class="fee-tooltip-section">
          <div class="fee-tooltip-row">
            <span class="fee-label">Ремонти</span>
            <span class="fee-amount">€${repairsFee.toFixed(2)}</span>
          </div>
          <div class="fee-tooltip-destination">→ Сметка за ремонти</div>
          <div class="fee-tooltip-note">(фиксирана такса)</div>
        </div>
        <div class="fee-tooltip-section">
          <div class="fee-tooltip-row">
            <span class="fee-label">Текущи разходи</span>
            <span class="fee-amount">€${currentExpensesFee.toFixed(2)}</span>
          </div>
          <div class="fee-tooltip-destination">→ Сметка за текущи разходи</div>
          ${
            residentsCount > 0
              ? `<div class="fee-tooltip-note">${residentsCount} човек × €${(floorNumber <=
                2
                  ? 1.5
                  : 4.0
                ).toFixed(2)} за ${floorNumber <= 2 ? '1-2' : '3-8'} етаж</div>`
              : `<div class="fee-tooltip-note">няма живущи</div>`
          }
        </div>
      </div>
    `;
  }
}
