import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, AlertCircle, Filter, Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { SaudiProduct, ProductVerificationStatus } from '@/admin/types/saudi-admin';
import { ProductsService } from '@/admin/services/products.service';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function ProductVerificationQueue() {
  const [products, setProducts] = useState<SaudiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<SaudiProduct | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadVerificationQueue();
  }, []);

  const loadVerificationQueue = async () => {
    setLoading(true);
    try {
      const response = await ProductsService.getVerificationQueue();
      setProducts(response);
    } catch (error) {
      console.error('Error loading verification queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedProduct) return;
    
    setProcessingId(selectedProduct.id);
    try {
      await ProductsService.approveProduct(selectedProduct.id, approvalNote);
      setShowApproveDialog(false);
      setApprovalNote('');
      setSelectedProduct(null);
      loadVerificationQueue(); // Refresh the list
    } catch (error) {
      console.error('Error approving product:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedProduct) return;
    
    setProcessingId(selectedProduct.id);
    try {
      await ProductsService.rejectProduct(selectedProduct.id, rejectionReason);
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedProduct(null);
      loadVerificationQueue(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting product:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: ProductVerificationStatus) => {
    const statusConfig = {
      [ProductVerificationStatus.PENDING]: { 
        label: 'Pending', 
        variant: 'secondary' as const,
        icon: Clock 
      },
      [ProductVerificationStatus.UNDER_REVIEW]: { 
        label: 'Under Review', 
        variant: 'outline' as const,
        icon: Eye 
      },
      [ProductVerificationStatus.APPROVED]: { 
        label: 'Approved', 
        variant: 'default' as const,
        icon: Check 
      },
      [ProductVerificationStatus.REJECTED]: { 
        label: 'Rejected', 
        variant: 'destructive' as const,
        icon: X 
      },
      [ProductVerificationStatus.REQUIRES_INFO]: { 
        label: 'Requires Info', 
        variant: 'outline' as const,
        icon: AlertCircle 
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (product: SaudiProduct) => {
    if (product.price.amount > 5000) return 'border-red-200 bg-red-50';
    if (product.price.amount > 1000) return 'border-orange-200 bg-orange-50';
    return '';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.nameAr.includes(searchTerm) ||
      product.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || product.verificationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = products.filter(p => p.verificationStatus === ProductVerificationStatus.PENDING).length;
  const underReviewCount = products.filter(p => p.verificationStatus === ProductVerificationStatus.UNDER_REVIEW).length;
  const highValueCount = products.filter(p => p.price.amount > 5000).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Verification Queue</h1>
          <p className="text-muted-foreground">Review and approve products requiring verification</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-2">
            <Clock className="h-4 w-4" />
            {pendingCount} Pending
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            {underReviewCount} Under Review
          </Badge>
          {highValueCount > 0 && (
            <Badge variant="destructive" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              {highValueCount} High Value
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by product or seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={ProductVerificationStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={ProductVerificationStatus.UNDER_REVIEW}>Under Review</SelectItem>
                  <SelectItem value={ProductVerificationStatus.REQUIRES_INFO}>Requires Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Products in Verification Queue</CardTitle>
          <CardDescription>
            Showing {filteredProducts.length} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products in verification queue</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Product</TableHead>
                  <TableHead className="text-left">Seller</TableHead>
                  <TableHead className="text-left">Price</TableHead>
                  <TableHead className="text-left">Category</TableHead>
                  <TableHead className="text-left">Status</TableHead>
                  <TableHead className="text-left">Date Added</TableHead>
                  <TableHead className="text-left">Compliance</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className={getPriorityColor(product)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={product.images[0]?.url} 
                            alt={product.nameAr}
                          />
                          <AvatarFallback>{product.nameAr.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{product.nameEn}</div>
                          <div className="text-sm text-muted-foreground">{product.nameAr}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.seller.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {product.seller.verificationStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {product.price.amount.toLocaleString()} {product.price.currency}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.price.vatIncluded ? 'VAT Included' : 'VAT Excluded'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category.nameEn || product.category.nameAr}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.verificationStatus)}</TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatDistanceToNow(new Date(product.createdAt), { 
                          addSuffix: true, 
                          locale: ar 
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {product.compliance.saudiStandards && (
                          <Badge variant="default" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            SASO
                          </Badge>
                        )}
                        {product.compliance.halalCertified && (
                          <Badge variant="default" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Halal
                          </Badge>
                        )}
                        {product.compliance.importLicense && (
                          <Badge variant="outline" className="text-xs">
                            Import License
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="gap-1"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        
                        <Dialog 
                          open={showApproveDialog && selectedProduct?.id === product.id}
                          onOpenChange={setShowApproveDialog}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              className="gap-1"
                              onClick={() => setSelectedProduct(product)}
                              disabled={processingId === product.id}
                            >
                              <Check className="h-3 w-3" />
                              موافقة
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>الموافقة على المنتج</DialogTitle>
                              <DialogDescription>
                                هل أنت متأكد من الموافقة على هذا المنتج؟
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="approval-note">ملاحظات الموافقة (اختياري)</Label>
                                <Textarea
                                  id="approval-note"
                                  value={approvalNote}
                                  onChange={(e) => setApprovalNote(e.target.value)}
                                  placeholder="أضف ملاحظة حول الموافقة..."
                                />
                              </div>
                            </div>
                            <DialogFooter className="gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setShowApproveDialog(false);
                                  setApprovalNote('');
                                }}
                                disabled={processingId === product.id}
                              >
                                إلغاء
                              </Button>
                              <Button 
                                onClick={handleApprove}
                                disabled={processingId === product.id}
                                className="gap-2"
                              >
                                {processingId === product.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                                موافقة
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog 
                          open={showRejectDialog && selectedProduct?.id === product.id}
                          onOpenChange={setShowRejectDialog}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="gap-1"
                              onClick={() => setSelectedProduct(product)}
                              disabled={processingId === product.id}
                            >
                              <X className="h-3 w-3" />
                              رفض
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>رفض المنتج</DialogTitle>
                              <DialogDescription>
                                يرجى تحديد سبب رفض هذا المنتج
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="rejection-reason">سبب الرفض *</Label>
                                <Textarea
                                  id="rejection-reason"
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder="اكتب سبب رفض المنتج..."
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter className="gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setShowRejectDialog(false);
                                  setRejectionReason('');
                                }}
                                disabled={processingId === product.id}
                              >
                                إلغاء
                              </Button>
                              <Button 
                                variant="destructive"
                                onClick={handleReject}
                                disabled={processingId === product.id || !rejectionReason.trim()}
                                className="gap-2"
                              >
                                {processingId === product.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                                رفض المنتج
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product Details Modal */}
      {selectedProduct && !showApproveDialog && !showRejectDialog && (
        <Dialog 
          open={Boolean(selectedProduct)} 
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>تفاصيل المنتج - {selectedProduct.nameAr}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Product Images */}
              <div>
                <h3 className="font-semibold mb-2">صور المنتج</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedProduct.images.map((image) => (
                    <div key={image.id} className="relative">
                      <img 
                        src={image.url} 
                        alt={image.alt}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      {image.isPrimary && (
                        <Badge className="absolute top-1 right-1 text-xs">
                          رئيسية
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Product Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name (English):</span> {selectedProduct.nameEn}</p>
                    <p><span className="font-medium">Name (Arabic):</span> {selectedProduct.nameAr}</p>
                    <p><span className="font-medium">Category:</span> {selectedProduct.category.nameEn || selectedProduct.category.nameAr}</p>
                    <p><span className="font-medium">Price:</span> {selectedProduct.price.amount.toLocaleString()} {selectedProduct.price.currency}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Seller Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedProduct.seller.name}</p>
                    <p><span className="font-medium">Verification Level:</span> {selectedProduct.seller.verificationStatus}</p>
                  </div>
                </div>
              </div>

              {/* Compliance & Standards */}
              <div>
                <h3 className="font-semibold mb-2">Standards & Compliance</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${selectedProduct.compliance.saudiStandards ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span>Saudi SASO Standards</span>
                  </div>
                  {selectedProduct.compliance.halalCertified !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${selectedProduct.compliance.halalCertified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>Halal Certificate</span>
                    </div>
                  )}
                  {selectedProduct.compliance.importLicense && (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span>Import License: {selectedProduct.compliance.importLicense}</span>
                    </div>
                  )}
                  {selectedProduct.compliance.customsCode && (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span>Customs Code: {selectedProduct.compliance.customsCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications */}
              {selectedProduct.specifications.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedProduct.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between text-sm border-b pb-1">
                        <span className="font-medium">{spec.nameEn || spec.nameAr}</span>
                        <span>{spec.valueEn || spec.valueAr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {selectedProduct.adminNotes && selectedProduct.adminNotes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Admin Notes</h3>
                  <div className="space-y-2">
                    {selectedProduct.adminNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-muted rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{note.adminName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true, locale: ar })}
                          </span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}