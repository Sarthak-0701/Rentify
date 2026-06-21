import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../supabase/store/AuthStore';
import { rentalService } from '../../supabase/services/rentalServices';
import { 
  Building, 
  Users, 
  IndianRupee, 
  Loader2, 
  AlertTriangle,
  TrendingUp,
  Percent,
  CheckCircle2,
  Wallet
} from 'lucide-react';

const RentManagement = () => {
  const user = useAuthStore((state) => state.user);

  // States
  const [properties, setProperties] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await rentalService.getOwnerDashboardStats(user.id);
      setProperties(data.properties || []);
      setReceipts(data.receipts || []);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Failed to load dashboard metrics. Please reload.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Compute Overall stats
  const totalProperties = properties.length;
  
  let totalRooms = 0;
  let totalTenants = 0;
  properties.forEach(p => {
    if (p.rooms) {
      totalRooms += p.rooms.length;
      totalTenants += p.rooms.filter(r => r.tenant_name && r.tenant_name.trim() !== '').length;
    }
  });

  const overallOccupancy = totalRooms > 0 ? Math.round((totalTenants / totalRooms) * 105) : 0;
  const cappedOccupancy = Math.min(100, overallOccupancy); // Cap at 100%

  // Financial aggregates
  const totalRevenue = receipts
    .filter(r => r.status === 'Paid')
    .reduce((sum, r) => sum + (Number(r.total_bill) || 0), 0);

  const duePayments = receipts
    .filter(r => r.status !== 'Paid')
    .reduce((sum, r) => sum + (Number(r.total_bill) || 0), 0);

  const estimatedRevenue = receipts.reduce((sum, r) => sum + (Number(r.total_bill) || 0), 0);

  // Portfolio Overview Cards
  const portfolioCards = [
    { 
      title: "Total Properties", 
      value: totalProperties, 
      icon: <Building className="w-5 h-5 text-blue-400" />,
      subtext: `${totalRooms} total rooms listed`
    },
    { 
      title: "Total Tenants", 
      value: totalTenants, 
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      subtext: `Active occupants`
    },
    { 
      title: "Portfolio Occupancy", 
      value: `${cappedOccupancy}%`, 
      icon: <Percent className="w-5 h-5 text-indigo-400" />,
      subtext: `${totalTenants} of ${totalRooms} rooms occupied`
    }
  ];

  // Financial Overview Cards
  const financialCards = [
    { 
      title: "Collected Revenue", 
      value: `₹${totalRevenue.toLocaleString('en-IN')}`, 
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      subtext: `From paid statements`,
      styleClass: "bg-emerald-950/10 border-emerald-900/30 hover:border-emerald-500/50 hover:bg-emerald-950/20",
      lineClass: "bg-emerald-500/40",
      valueClass: "text-emerald-400",
      overlayClass: "bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.02] to-transparent group-hover:from-emerald-500/[0.12]"
    },
    { 
      title: "Due Payments", 
      value: `₹${duePayments.toLocaleString('en-IN')}`, 
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      subtext: `Pending statements`,
      styleClass: "bg-red-950/10 border-red-900/30 hover:border-red-500/50 hover:bg-red-950/20",
      lineClass: "bg-red-500/40",
      valueClass: "text-red-400",
      overlayClass: "bg-gradient-to-br from-red-500/[0.08] via-red-500/[0.02] to-transparent group-hover:from-red-500/[0.12]"
    },
    { 
      title: "Estimated Revenue", 
      value: `₹${estimatedRevenue.toLocaleString('en-IN')}`, 
      icon: <IndianRupee className="w-5 h-5 text-blue-400" />,
      subtext: `Collected + Outstanding`,
      styleClass: "bg-blue-950/10 border-blue-900/30 hover:border-blue-500/50 hover:bg-blue-950/20",
      lineClass: "bg-blue-500/40",
      valueClass: "text-blue-400",
      overlayClass: "bg-gradient-to-br from-blue-500/[0.08] via-blue-500/[0.02] to-transparent group-hover:from-blue-500/[0.12]"
    }
  ];

  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Calculating portfolio statement metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-red-950/20 border border-red-900/30 rounded-2xl flex flex-col md:flex-row items-center gap-4 max-w-xl mx-auto my-12">
        <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold text-red-400">An error occurred</h3>
          <p className="text-xs text-red-300 mt-1">{error}</p>
        </div>
        <button 
          onClick={fetchDashboardData} 
          className="px-4 py-1.5 text-xs font-semibold bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-800 rounded-lg cursor-pointer transition-colors md:ml-auto"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-[60vh] gap-8 font-sans text-slate-100">
      
      {/* Row 1: Portfolio Analytics Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 select-none">Portfolio Metrics</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioCards.map((card, idx) => (
            <div 
              key={idx} 
              className="p-5 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-slate-800 transition-all"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-900 group-hover:bg-blue-500/45 transition-colors" />
              
              <div className="space-y-1 select-none">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.title}</h3>
                <h1 className="text-2xl font-black text-slate-200 tracking-tight">{card.value}</h1>
                <p className="text-[10px] text-slate-500">{card.subtext}</p>
              </div>
              
              <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shadow-md">
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Financial Summary Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 select-none">Financial Performance</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {financialCards.map((card, idx) => (
            <div 
              key={idx} 
              className={`p-5 border rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group transition-all ${card.styleClass}`}
            >
              {/* Colored Glassmorphic Overlay */}
              <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${card.overlayClass}`} />

              <div className={`absolute top-0 left-0 right-0 h-[2px] ${card.lineClass} z-10`} />
              
              <div className="space-y-1 select-none z-10">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.title}</h3>
                <h1 className={`text-2xl font-black tracking-tight font-mono ${card.valueClass} z-10`}>{card.value}</h1>
                <p className="text-[10px] text-slate-500 z-10">{card.subtext}</p>
              </div>
              
              <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shadow-md z-10">
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Property Breakdown Section */}
      <div className="p-6 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-900" />
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-md font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" /> Property Performance Analytics
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Breakdown of occupancy rates and detailed revenue metrics for each active property.
            </p>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-900 rounded-xl bg-slate-950/10">
            <Building className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <h4 className="text-xs font-semibold text-slate-400">No Properties Found</h4>
            <p className="text-[10px] text-slate-500 mt-1">Please add properties under the "Manage Properties" section to see analytics here.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((prop) => {
              const propRooms = prop.rooms || [];
              const propRoomsCount = propRooms.length;
              const propTenantsCount = propRooms.filter(r => r.tenant_name && r.tenant_name.trim() !== '').length;
              const propOccupancy = propRoomsCount > 0 ? Math.round((propTenantsCount / propRoomsCount) * 100) : 0;
              
              // Filter receipts associated with this property
              const propReceipts = receipts.filter(r => r.property_id === prop.id);
              
              // Compute property level revenue divisions
              const propCollected = propReceipts
                .filter(r => r.status === 'Paid')
                .reduce((sum, r) => sum + (Number(r.total_bill) || 0), 0);

              const propDue = propReceipts
                .filter(r => r.status !== 'Paid')
                .reduce((sum, r) => sum + (Number(r.total_bill) || 0), 0);

              const propEstimated = propReceipts.reduce((sum, r) => sum + (Number(r.total_bill) || 0), 0);

              return (
                <div 
                  key={prop.id}
                  className="p-5 bg-black/40 border border-slate-900 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-all shadow-md group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-900 group-hover:bg-blue-500/25 transition-colors" />

                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors uppercase tracking-wide truncate">
                        {prop.name}
                      </h4>
                      <div className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center shrink-0">
                        <Building className="w-3.5 h-3.5 text-blue-500/60" />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-l border-slate-900 pl-3 mb-4 text-xs text-slate-400 select-none">
                      <div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase">Total Rooms</div>
                        <div className="font-semibold text-slate-300 mt-0.5">{propRoomsCount} rooms</div>
                      </div>
                      <div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase">Active Tenants</div>
                        <div className="font-semibold text-slate-300 mt-0.5">{propTenantsCount} active</div>
                      </div>
                    </div>

                    {/* Occupancy Rate Progress */}
                    <div className="space-y-1.5 mb-5 select-none">
                      <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                        <span>Occupancy Rate</span>
                        <span className="text-blue-400">{propOccupancy}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 border border-slate-950 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${propOccupancy}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial details breakdown inside property card */}
                  <div className="border-t border-slate-900/65 pt-3.5 mt-2 space-y-2 select-none">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Collected Revenue</span>
                      <span className="font-bold text-emerald-400 font-mono">₹{propCollected.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Due Payments</span>
                      <span className="font-bold text-red-400 font-mono">₹{propDue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-900/40 pt-1.5">
                      <span className="font-bold uppercase tracking-wider text-[8px] text-slate-500">Estimated Revenue</span>
                      <span className="font-black text-blue-400 font-mono text-xs">₹{propEstimated.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default RentManagement;