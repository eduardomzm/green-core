import React, { useState, useEffect } from 'react';
import { getRankings, type RankingsResponse } from '../services/reciclajeService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Users, GraduationCap, Building2, Box, RefreshCw } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

type FilterType = 'carreras' | 'alumnos' | 'grupos' | 'materiales';
type TimeframeType = 'general' | 'semanal';

const Rankings = () => {
  const [data, setData] = useState<RankingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<TimeframeType>('general');
  const [activeFilter, setActiveFilter] = useState<FilterType>('alumnos');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const fetchData = async () => {
    try {
      const result = await getRankings(timeframe);
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching rankings", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
    // Poll every 10 seconds
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, [timeframe]);
  const getChartData = () => {
    if (!data) return [];
    switch (activeFilter) {
      case 'alumnos':
        return data.top_alumnos.map(item => ({
          name: item.alumno__first_name || item.alumno__username,
          value: item.total_piezas
        }));
      case 'grupos':
        return data.top_grupos.map(item => ({
          name: item.alumno__alumnogrupo__grupo__nombre,
          value: item.total_piezas
        }));
      case 'carreras':
        return data.top_carreras.map(item => ({
          name: item.alumno__alumnogrupo__grupo__carrera__nombre,
          value: item.total_piezas
        }));
      case 'materiales':
        return data.top_materiales.map(item => ({
          name: item.material__nombre,
          value: item.total_piezas
        }));
      default:
        return [];
    }
  };
  const chartData = getChartData();
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Rankings de Reciclaje
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <RefreshCw className="w-4 h-4" /> 
            Actualizado por última vez: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setTimeframe('general')}
            className={`cursor-pointer px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              timeframe === 'general' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setTimeframe('semanal')}
            className={`cursor-pointer px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              timeframe === 'semanal' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Semanal
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
          <FilterButton
            active={activeFilter === 'alumnos'}
            onClick={() => setActiveFilter('alumnos')}
            icon={<Users className="w-4 h-4" />}
            label="Alumnos"
          />
          <FilterButton
            active={activeFilter === 'grupos'}
            onClick={() => setActiveFilter('grupos')}
            icon={<Building2 className="w-4 h-4" />}
            label="Grupos"
          />
          <FilterButton
            active={activeFilter === 'carreras'}
            onClick={() => setActiveFilter('carreras')}
            icon={<GraduationCap className="w-4 h-4" />}
            label="Carreras"
          />
          <FilterButton
            active={activeFilter === 'materiales'}
            onClick={() => setActiveFilter('materiales')}
            icon={<Box className="w-4 h-4" />}
            label="Materiales"
          />
        </div>
        {loading && !data ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="value" name="Piezas Totales" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No hay datos suficientes para mostrar en este ranking.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
      active 
        ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-2' 
        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default Rankings;