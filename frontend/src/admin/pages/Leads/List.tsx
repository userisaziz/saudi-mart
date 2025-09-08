import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Eye, MessageCircle, Calendar, Star, User } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Progress } from '@/shared/components/ui/progress';
import { AdminLead, LeadStatus, LeadPriority, LeadSource, SaudiRegion } from '@/admin/types/saudi-admin';
import { LeadsService } from '@/admin/services/leads.service';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function AdminLeadsList() {
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    source: '',
    region: '',
    assignedTo: '',
    scoreMin: '',
    scoreMax: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    newLeads: 0,
    contacted: 0,
    qualified: 0,
    closedWon: 0,
    conversionRate: 0,
    avgScore: 0,
    bySource: {} as Record<LeadSource, number>,
    byRegion: {} as Record<SaudiRegion, number>,
    followUpToday: 0
  });

  const itemsPerPage = 10;

  useEffect(() => {
    loadLeads();
    loadStats();
  }, [currentPage, searchTerm, filters]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const response = await LeadsService.getLeads({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: filters.status as LeadStatus || undefined,
        priority: filters.priority as LeadPriority || undefined,
        source: filters.source as LeadSource || undefined,
        region: filters.region as SaudiRegion || undefined,
        assignedTo: filters.assignedTo || undefined,
        scoreMin: filters.scoreMin ? parseInt(filters.scoreMin) : undefined,
        scoreMax: filters.scoreMax ? parseInt(filters.scoreMax) : undefined
      });

      setLeads(response.leads);
      setTotalLeads(response.total);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const leadStats = await LeadsService.getLeadStats();
      setStats(leadStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await LeadsService.updateLeadStatus(leadId, newStatus);
      loadLeads(); // Refresh the list
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleAssignLead = async (leadId: string, assignedTo: string) => {
    try {
      await LeadsService.assignLead(leadId, assignedTo);
      loadLeads(); // Refresh the list
    } catch (error) {
      console.error('Error assigning lead:', error);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    const statusConfig = {
      [LeadStatus.NEW]: { label: 'New', variant: 'secondary' as const, color: 'bg-blue-500' },
      [LeadStatus.CONTACTED]: { label: 'Contacted', variant: 'outline' as const, color: 'bg-yellow-500' },
      [LeadStatus.QUALIFIED]: { label: 'Qualified', variant: 'default' as const, color: 'bg-green-500' },
      [LeadStatus.PROPOSAL_SENT]: { label: 'Proposal Sent', variant: 'default' as const, color: 'bg-orange-500' },
      [LeadStatus.NEGOTIATION]: { label: 'Negotiation', variant: 'outline' as const, color: 'bg-purple-500' },
      [LeadStatus.CLOSED_WON]: { label: 'Closed Won', variant: 'default' as const, color: 'bg-green-600' },
      [LeadStatus.CLOSED_LOST]: { label: 'Closed Lost', variant: 'destructive' as const, color: 'bg-red-500' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: LeadPriority) => {
    const priorityConfig = {
      [LeadPriority.LOW]: { label: 'Low', variant: 'outline' as const },
      [LeadPriority.MEDIUM]: { label: 'Medium', variant: 'secondary' as const },
      [LeadPriority.HIGH]: { label: 'High', variant: 'default' as const },
      [LeadPriority.URGENT]: { label: 'Urgent', variant: 'destructive' as const }
    };

    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getSourceIcon = (source: LeadSource) => {
    const sourceIcons = {
      [LeadSource.WEBSITE]: '🌐',
      [LeadSource.PHONE]: '📞',
      [LeadSource.EMAIL]: '📧',
      [LeadSource.SOCIAL_MEDIA]: '📱',
      [LeadSource.REFERRAL]: '👥',
      [LeadSource.ADVERTISEMENT]: '📺'
    };
    return sourceIcons[source];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const StatsCard = ({ title, value, subtitle, icon: Icon }: { 
    title: string; 
    value: number | string; 
    subtitle?: string; 
    icon?: React.ElementType;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground">Track and manage potential customers and sales pipeline</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total Leads" value={stats.total} icon={User} />
        <StatsCard title="New Leads" value={stats.newLeads} icon={Star} />
        <StatsCard title="Contacted" value={stats.contacted} icon={MessageCircle} />
        <StatsCard title="Qualified" value={stats.qualified} />
        <StatsCard 
          title="Conversion Rate" 
          value={`${stats.conversionRate.toFixed(1)}%`}
          subtitle={`${stats.closedWon} closed deals`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Follow-ups Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-lg">{stats.followUpToday}</span>
              <span className="text-muted-foreground">leads need follow-up today</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{stats.avgScore.toFixed(0)}/100</div>
              <Progress value={stats.avgScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, phone, product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={LeadStatus.NEW}>New</SelectItem>
                  <SelectItem value={LeadStatus.CONTACTED}>Contacted</SelectItem>
                  <SelectItem value={LeadStatus.QUALIFIED}>Qualified</SelectItem>
                  <SelectItem value={LeadStatus.CLOSED_WON}>Closed Won</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value={LeadPriority.URGENT}>Urgent</SelectItem>
                  <SelectItem value={LeadPriority.HIGH}>High</SelectItem>
                  <SelectItem value={LeadPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={LeadPriority.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value={LeadSource.WEBSITE}>Website</SelectItem>
                  <SelectItem value={LeadSource.PHONE}>Phone</SelectItem>
                  <SelectItem value={LeadSource.EMAIL}>Email</SelectItem>
                  <SelectItem value={LeadSource.SOCIAL_MEDIA}>Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Score:</label>
              <Input
                placeholder="From"
                value={filters.scoreMin}
                onChange={(e) => setFilters(prev => ({ ...prev, scoreMin: e.target.value }))}
                className="w-20"
                type="number"
                min="0"
                max="100"
              />
              <span>-</span>
              <Input
                placeholder="To"
                value={filters.scoreMax}
                onChange={(e) => setFilters(prev => ({ ...prev, scoreMax: e.target.value }))}
                className="w-20"
                type="number"
                min="0"
                max="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads List</CardTitle>
          <CardDescription>
            Showing {leads.length} of {totalLeads} total leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product Interest</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${lead.customerInfo.email}`} />
                          <AvatarFallback>{lead.customerInfo.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{lead.customerInfo.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.customerInfo.phone}</div>
                          <div className="text-xs text-muted-foreground">
                            {lead.customerInfo.city}, {lead.customerInfo.region}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.productInterest.productName}</div>
                        <div className="text-sm text-muted-foreground">{lead.productInterest.category}</div>
                        {lead.productInterest.priceRange && (
                          <div className="text-xs text-muted-foreground">
                            {lead.productInterest.priceRange.min.toLocaleString()} - {lead.productInterest.priceRange.max.toLocaleString()} SAR
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>{getPriorityBadge(lead.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-current rounded-full" 
                            style={{ width: `${lead.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getSourceIcon(lead.source)}</span>
                        <span className="text-sm">{lead.source}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.assignedTo ? (
                        <Badge variant="outline">{lead.assignedTo}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.lastContactDate ? (
                        <span className="text-sm">
                          {formatDistanceToNow(new Date(lead.lastContactDate), { addSuffix: true, locale: ar })}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never contacted</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-right">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Start Conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Schedule Follow-up
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <User className="h-4 w-4" />
                            Assign to Me
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalLeads > itemsPerPage && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalLeads)} of {totalLeads} total leads
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(totalLeads / itemsPerPage) }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === Math.ceil(totalLeads / itemsPerPage) || 
                      Math.abs(page - currentPage) <= 2
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalLeads / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(totalLeads / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}