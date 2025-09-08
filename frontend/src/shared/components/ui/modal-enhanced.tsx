import React from 'react'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './dialog'
import { Button } from './button'
import { Badge } from './badge'
import { cn } from '@/shared/utils/cn'

interface ModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  locale?: 'en' | 'ar'
  type?: 'default' | 'confirm' | 'alert' | 'success' | 'warning' | 'error'
  className?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

interface ConfirmModalProps extends Omit<ModalProps, 'footer' | 'type'> {
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  confirmTextAr?: string
  cancelText?: string
  cancelTextAr?: string
  confirmVariant?: 'default' | 'destructive' | 'success'
  loading?: boolean
}

interface AlertModalProps extends Omit<ModalProps, 'footer' | 'type'> {
  onClose: () => void
  closeText?: string
  closeTextAr?: string
  type: 'success' | 'warning' | 'error' | 'info'
}

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl'
}

const getTypeIcon = (type: 'success' | 'warning' | 'error' | 'info' | 'confirm') => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-6 w-6 text-success" />
    case 'warning':
      return <AlertTriangle className="h-6 w-6 text-warning" />
    case 'error':
      return <AlertCircle className="h-6 w-6 text-destructive" />
    case 'info':
      return <Info className="h-6 w-6 text-primary" />
    case 'confirm':
      return <AlertTriangle className="h-6 w-6 text-warning" />
    default:
      return null
  }
}

const getTypeColors = (type: string) => {
  switch (type) {
    case 'success':
      return 'border-success/20 bg-success/5'
    case 'warning':
      return 'border-warning/20 bg-warning/5'
    case 'error':
      return 'border-destructive/20 bg-destructive/5'
    case 'info':
      return 'border-primary/20 bg-primary/5'
    case 'confirm':
      return 'border-warning/20 bg-warning/5'
    default:
      return ''
  }
}

export const ModalEnhanced: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  titleAr,
  description,
  descriptionAr,
  children,
  footer,
  size = 'md',
  locale = 'en',
  type = 'default',
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true
}) => {
  const isRtl = locale === 'ar'
  const displayTitle = locale === 'ar' && titleAr ? titleAr : title
  const displayDescription = locale === 'ar' && descriptionAr ? descriptionAr : description
  
  const typeIcon = type !== 'default' ? getTypeIcon(type as any) : null
  const typeColors = getTypeColors(type)

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent 
        className={cn(
          modalSizes[size],
          typeColors,
          "max-h-[90vh] overflow-hidden flex flex-col",
          isRtl && "text-right",
          className
        )}
        dir={isRtl ? 'rtl' : 'ltr'}
        onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {typeIcon}
              <div className="flex-1 min-w-0">
                <DialogTitle className={cn(
                  "text-lg font-semibold",
                  locale === 'ar' && "font-arabic text-right"
                )}>
                  {displayTitle}
                </DialogTitle>
                {displayDescription && (
                  <DialogDescription className={cn(
                    "mt-1",
                    locale === 'ar' && "text-right"
                  )}>
                    {displayDescription}
                  </DialogDescription>
                )}
              </div>
            </div>
            
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
                onClick={() => onOpenChange?.(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {children}
        </div>

        {footer && (
          <DialogFooter className="flex-shrink-0">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onConfirm,
  onCancel,
  confirmText,
  confirmTextAr,
  cancelText,
  cancelTextAr,
  confirmVariant = 'destructive',
  loading = false,
  locale = 'en',
  ...props
}) => {
  const displayConfirmText = locale === 'ar' && confirmTextAr 
    ? confirmTextAr 
    : confirmText || (locale === 'ar' ? 'تأكيد' : 'Confirm')
  
  const displayCancelText = locale === 'ar' && cancelTextAr
    ? cancelTextAr
    : cancelText || (locale === 'ar' ? 'إلغاء' : 'Cancel')

  const isRtl = locale === 'ar'

  const footer = (
    <div className={cn(
      "flex space-x-2 rtl:space-x-reverse",
      isRtl ? "flex-row-reverse" : ""
    )}>
      <Button
        variant="outline"
        onClick={() => {
          onCancel?.()
          props.onOpenChange?.(false)
        }}
        disabled={loading}
      >
        {displayCancelText}
      </Button>
      <Button
        variant={confirmVariant}
        onClick={onConfirm}
        loading={loading}
      >
        {displayConfirmText}
      </Button>
    </div>
  )

  return (
    <ModalEnhanced
      {...props}
      type="confirm"
      locale={locale}
      footer={footer}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    />
  )
}

export const AlertModal: React.FC<AlertModalProps> = ({
  onClose,
  closeText,
  closeTextAr,
  type,
  locale = 'en',
  ...props
}) => {
  const displayCloseText = locale === 'ar' && closeTextAr
    ? closeTextAr
    : closeText || (locale === 'ar' ? 'موافق' : 'OK')

  const footer = (
    <Button onClick={onClose}>
      {displayCloseText}
    </Button>
  )

  return (
    <ModalEnhanced
      {...props}
      type={type}
      locale={locale}
      footer={footer}
      onOpenChange={(open) => !open && onClose()}
    />
  )
}

// Specialized Modals for Saudi Admin Dashboard

interface ApprovalModalProps extends Omit<ConfirmModalProps, 'confirmText' | 'cancelText' | 'title'> {
  itemType: string
  itemTypeAr?: string
  itemName: string
  action: 'approve' | 'reject'
  reason?: string
  onReasonChange?: (reason: string) => void
  requireReason?: boolean
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  itemType,
  itemTypeAr,
  itemName,
  action,
  reason,
  onReasonChange,
  requireReason = false,
  locale = 'en',
  ...props
}) => {
  const isApprove = action === 'approve'
  const isRtl = locale === 'ar'
  
  const displayItemType = locale === 'ar' && itemTypeAr ? itemTypeAr : itemType
  
  const title = locale === 'ar'
    ? `${isApprove ? 'موافقة' : 'رفض'} ${displayItemType}`
    : `${isApprove ? 'Approve' : 'Reject'} ${displayItemType}`
  
  const description = locale === 'ar'
    ? `هل أنت متأكد من ${isApprove ? 'الموافقة على' : 'رفض'} "${itemName}"؟`
    : `Are you sure you want to ${action} "${itemName}"?`

  return (
    <ConfirmModal
      {...props}
      title={title}
      description={description}
      confirmText={locale === 'ar' ? (isApprove ? 'موافقة' : 'رفض') : (isApprove ? 'Approve' : 'Reject')}
      confirmVariant={isApprove ? 'success' : 'destructive'}
      locale={locale}
    >
      {(requireReason || action === 'reject') && (
        <div className="space-y-2">
          <label className={cn(
            "block text-sm font-medium",
            isRtl && "text-right"
          )}>
            {locale === 'ar' 
              ? (action === 'reject' ? 'سبب الرفض' : 'ملاحظات') 
              : (action === 'reject' ? 'Rejection Reason' : 'Notes')
            }
            {(requireReason || action === 'reject') && (
              <span className="text-destructive ml-1 rtl:mr-1 rtl:ml-0">*</span>
            )}
          </label>
          <textarea
            className={cn(
              "w-full px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              isRtl && "text-right",
              locale === 'ar' && "font-arabic"
            )}
            rows={3}
            value={reason || ''}
            onChange={(e) => onReasonChange?.(e.target.value)}
            placeholder={locale === 'ar' 
              ? 'اكتب السبب هنا...' 
              : 'Enter reason here...'
            }
            dir={isRtl ? 'rtl' : 'ltr'}
            required={requireReason || action === 'reject'}
          />
        </div>
      )}
    </ConfirmModal>
  )
}

// Bulk Actions Modal
interface BulkActionModalProps extends Omit<ConfirmModalProps, 'title' | 'description'> {
  action: string
  actionAr?: string
  selectedCount: number
  itemType: string
  itemTypeAr?: string
}

export const BulkActionModal: React.FC<BulkActionModalProps> = ({
  action,
  actionAr,
  selectedCount,
  itemType,
  itemTypeAr,
  locale = 'en',
  ...props
}) => {
  const displayAction = locale === 'ar' && actionAr ? actionAr : action
  const displayItemType = locale === 'ar' && itemTypeAr ? itemTypeAr : itemType
  
  const title = locale === 'ar'
    ? `${displayAction} المحدد`
    : `Bulk ${displayAction}`
  
  const description = locale === 'ar'
    ? `هل أنت متأكد من ${displayAction} ${selectedCount} ${displayItemType}؟`
    : `Are you sure you want to ${action.toLowerCase()} ${selectedCount} ${itemType}(s)?`

  return (
    <ConfirmModal
      {...props}
      title={title}
      description={description}
      locale={locale}
    />
  )
}