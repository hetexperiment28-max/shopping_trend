import React, { useState, useEffect, useRef } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, Bot, X, Send, 
  Sparkles, Calendar, ArrowUpRight, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api';

function App() {
  const [summary, setSummary] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [insightsData, setInsightsData] = useState({ insights: [], suggestions: [] });
  
  // Filter state: 'monthly' | 'quarterly' | 'custom'
  const [aggregation, setAggregation] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hello! I am your Shopping Data AI Assistant. Ask me anything about sales growth, top categories, channel breakdown, or growth suggestions.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    fetchSummary();
    fetchCategorySales();
    fetchInsights();
  }, []);

  useEffect(() => {
    fetchSalesTrend();
  }, [aggregation, startDate, endDate]);

  useEffect(() => {
    if (isChatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/summary`);
      const data = await res.json();
      setSummary(data);
    } catch (e) {
      console.error("Summary fetch error:", e);
    }
  };

  const fetchCategorySales = async () => {
    try {
      const res = await fetch(`${API_URL}/category-sales`);
      const data = await res.json();
      setCategorySales(data);
    } catch (e) {
      console.error("Category sales fetch error:", e);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await fetch(`${API_URL}/insights`);
      const data = await res.json();
      setInsightsData(data);
    } catch (e) {
      console.error("Insights fetch error:", e);
    }
  };

  const fetchSalesTrend = async () => {
    try {
      const params = new URLSearchParams({ aggregation });
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const res = await fetch(`${API_URL}/sales-trend?${params.toString()}`);
      const data = await res.json();
      setSalesTrend(data);
    } catch (e) {
      console.error("Sales trend fetch error:", e);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim() || isSending) return;

    const userMsg = { sender: 'user', text };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsSending(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (e) {
      setChatMessages(prev => [
        ...prev, 
        { sender: 'bot', text: '⚠️ Connection issue with AI insights backend.' }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const growth = payload[0].payload?.growth;
      return (
        <div style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          padding: '0.65rem 0.85rem',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '3px' }}>{label}</p>
          <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '14px' }}>
            ₹{val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          {growth !== undefined && (
            <p style={{ 
              color: growth >= 0 ? 'var(--accent-emerald)' : '#dc2626', 
              fontSize: '11px', 
              fontWeight: 600,
              marginTop: '2px' 
            }}>
              {growth >= 0 ? `▲ +${growth}%` : `▼ ${growth}%`} period growth
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <div className="brand-badge">
            <ShieldCheck size={14} /> Retail Intelligence Hub
          </div>
          <h1 className="dashboard-title">Shopping Trend Analysis</h1>
          <p className="dashboard-subtitle">Executive analytics, growth trends & AI data insights</p>
        </div>

        <div className="header-actions">
          <div className="token-saver-badge" title="Data pre-processed on backend into compact statistical context to avoid raw token scans">
            <Zap size={14} /> Token-Optimized AI Engine
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="dashboard-card kpi-card">
          <div className="kpi-header">
            <span>Total Revenue</span>
            <div className="kpi-icon" style={{ color: 'var(--accent-blue)' }}><DollarSign size={18} /></div>
          </div>
          <div className="kpi-value">
            {summary ? `₹${(summary.totalSales / 1000000).toFixed(2)}M` : '...'}
          </div>
          <div className="kpi-subtext">
            <span className="kpi-growth-tag">Across {summary?.totalTransactions.toLocaleString() || '...'}</span> total orders
          </div>
        </div>

        <div className="dashboard-card kpi-card">
          <div className="kpi-header">
            <span>Total Customers</span>
            <div className="kpi-icon" style={{ color: 'var(--accent-indigo)' }}><Users size={18} /></div>
          </div>
          <div className="kpi-value">
            {summary ? summary.totalCustomers.toLocaleString() : '...'}
          </div>
          <div className="kpi-subtext">
            Unique registered shoppers
          </div>
        </div>

        <div className="dashboard-card kpi-card">
          <div className="kpi-header">
            <span>Avg Order Value</span>
            <div className="kpi-icon" style={{ color: 'var(--accent-amber)' }}><ShoppingBag size={18} /></div>
          </div>
          <div className="kpi-value">
            {summary ? `₹${summary.avgPurchase.toLocaleString()}` : '...'}
          </div>
          <div className="kpi-subtext">
            Per transaction spend
          </div>
        </div>

        <div className="dashboard-card kpi-card">
          <div className="kpi-header">
            <span>Peak Momentum</span>
            <div className="kpi-icon" style={{ color: 'var(--accent-emerald)' }}><TrendingUp size={18} /></div>
          </div>
          <div className="kpi-value" style={{ fontSize: '1.4rem', color: 'var(--accent-emerald)' }}>
            {summary ? summary.peakGrowth : '...'}
          </div>
          <div className="kpi-subtext">
            Highest recorded monthly surge
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="dashboard-grid-2col">
        {/* Sales Trend Chart with Dynamic Filters */}
        <div className="dashboard-card">
          <div className="chart-card-header">
            <div className="chart-title-group">
              <h2 className="chart-title">Sales Performance Trend</h2>
              <div className="growth-banner">
                <ArrowUpRight size={14} /> Peak Performance Callout: 29.4% Growth in June 2023
              </div>
            </div>

            <div className="filter-bar">
              <div className="aggregation-tabs">
                <button 
                  className={`tab-btn ${aggregation === 'monthly' ? 'active' : ''}`}
                  onClick={() => setAggregation('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`tab-btn ${aggregation === 'quarterly' ? 'active' : ''}`}
                  onClick={() => setAggregation('quarterly')}
                >
                  Quarterly
                </button>
                <button 
                  className={`tab-btn ${aggregation === 'custom' ? 'active' : ''}`}
                  onClick={() => setAggregation('custom')}
                >
                  Custom
                </button>
              </div>

              {aggregation === 'custom' && (
                <div className="custom-date-inputs">
                  <input 
                    type="date" 
                    className="date-input" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                  />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>to</span>
                  <input 
                    type="date" 
                    className="date-input" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis 
                  stroke="var(--text-muted)" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                  tickFormatter={(val) => `₹${val / 1000}k`} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="var(--accent-blue)" 
                  strokeWidth={2} 
                  fillOpacity={0.06} 
                  fill="var(--accent-blue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Chart */}
        <div className="dashboard-card">
          <div className="chart-card-header">
            <div className="chart-title-group">
              <h2 className="chart-title">Revenue by Category</h2>
              <span className="chart-subtitle">Leading merchandise segments</span>
            </div>
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={categorySales} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-color)' }} />
                <Bar dataKey="sales" fill="var(--accent-indigo)" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights & Growth Suggestions Grid */}
      <div className="dashboard-grid-equal">
        {/* Executive AI Insights */}
        <div className="dashboard-card">
          <div className="chart-card-header" style={{ marginBottom: '0.75rem' }}>
            <div className="chart-title-group">
              <h2 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#3b82f6" /> AI Executive Data Insights
              </h2>
              <span className="chart-subtitle">Automated key findings from processed sales metrics</span>
            </div>
          </div>

          <div className="insights-grid">
            {insightsData.insights.map((item, idx) => (
              <div key={idx} className="insight-card">
                <span className={`insight-tag ${item.type}`}>{item.tag}</span>
                <h3 className="insight-title">{item.title}</h3>
                <p className="insight-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Growth Suggestions */}
        <div className="dashboard-card">
          <div className="chart-card-header" style={{ marginBottom: '0.75rem' }}>
            <div className="chart-title-group">
              <h2 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="#10b981" /> Strategic Growth Suggestions
              </h2>
              <span className="chart-subtitle">Data-backed growth recommendations</span>
            </div>
          </div>

          <div>
            {insightsData.suggestions.map((sug, idx) => (
              <div key={idx} className="suggestion-card">
                <div className="suggestion-header">
                  <h3 className="suggestion-title">{sug.title}</h3>
                  <span className="impact-badge">{sug.impact}</span>
                </div>
                <p className="suggestion-desc">{sug.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating AI Chatbot Button */}
      <button 
        className="chatbot-trigger-btn"
        onClick={() => setIsChatOpen(!isChatOpen)}
        title="Open AI Data Chat Assistant"
      >
        <Bot size={20} />
        <span>Ask AI Assistant</span>
        <div className="chat-pulse-dot" />
      </button>

      {/* AI Chat Assistant Drawer */}
      {isChatOpen && (
        <div className="chat-drawer">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="chat-title">Shopping Data AI</h3>
                <span className="chat-sub">⚡ Pre-processed Data • Free Token Engine</span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            <div className="token-info-pill">
              🛡️ Token Saver Active: CSV pre-processed into compact metrics JSON (~300 tokens)
            </div>

            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            
            {isSending && (
              <div className="chat-bubble bot" style={{ fontStyle: 'italic', color: '#94a3b8' }}>
                Parsing dataset insights...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="quick-prompts">
            <button 
              className="quick-prompt-btn" 
              onClick={() => handleSendMessage("What was the sales growth in June?")}
            >
              📈 Growth in June?
            </button>
            <button 
              className="quick-prompt-btn" 
              onClick={() => handleSendMessage("Which category sold the most?")}
            >
              🏷️ Top Category?
            </button>
            <button 
              className="quick-prompt-btn" 
              onClick={() => handleSendMessage("Give me growth suggestions")}
            >
              🚀 Suggestions?
            </button>
            <button 
              className="quick-prompt-btn" 
              onClick={() => handleSendMessage("What is the product return rate?")}
            >
              📦 Return Rate?
            </button>
          </div>

          {/* Chat Input */}
          <form 
            className="chat-input-form" 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          >
            <input 
              type="text"
              className="chat-input"
              placeholder="Ask anything about shopping data..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" disabled={isSending}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
