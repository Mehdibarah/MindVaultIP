import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Globe, Shield, Clock, DollarSign, Plus, Trash2, Save } from 'lucide-react';

const WebResearchSettings = () => {
  const [settings, setSettings] = useState({
    webResearchEnabled: true,
    maxCostPerRequest: 0.10,
    maxSourcesPerQuery: 5,
    searchTimeout: 8000,
    cacheTTL: 6,
    rateLimitPerDay: 30,
    allowedDomains: [
      '.gov', '.edu', '.org', '.int',
      'wipo.int', 'epo.org', 'uspto.gov', 'ieee.org',
      'nature.com', 'arxiv.org', 'scholar.google.com',
      'patents.google.com', 'worldwide.espacenet.com',
      'patentscope.wipo.int'
    ],
    blockedDomains: [
      't.me', 'pastebin.com', 'github.com/raw', 'gist.github.com',
      'bit.ly', 'tinyurl.com', 'short.link', 't.co'
    ]
  });

  const [newDomain, setNewDomain] = useState('');
  const [newBlockedDomain, setNewBlockedDomain] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('webResearchSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (in production, save to API)
      localStorage.setItem('webResearchSettings', JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addAllowedDomain = () => {
    if (newDomain.trim() && !settings.allowedDomains.includes(newDomain.trim())) {
      setSettings(prev => ({
        ...prev,
        allowedDomains: [...prev.allowedDomains, newDomain.trim()]
      }));
      setNewDomain('');
    }
  };

  const removeAllowedDomain = (domain) => {
    setSettings(prev => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter(d => d !== domain)
    }));
  };

  const addBlockedDomain = () => {
    if (newBlockedDomain.trim() && !settings.blockedDomains.includes(newBlockedDomain.trim())) {
      setSettings(prev => ({
        ...prev,
        blockedDomains: [...prev.blockedDomains, newBlockedDomain.trim()]
      }));
      setNewBlockedDomain('');
    }
  };

  const removeBlockedDomain = (domain) => {
    setSettings(prev => ({
      ...prev,
      blockedDomains: prev.blockedDomains.filter(d => d !== domain)
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Web Research Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="webResearchEnabled" className="text-slate-300">
                  Enable Web Research
                </Label>
                <Switch
                  id="webResearchEnabled"
                  checked={settings.webResearchEnabled}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, webResearchEnabled: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCostPerRequest" className="text-slate-300">
                  Max Cost Per Request ($)
                </Label>
                <Input
                  id="maxCostPerRequest"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={settings.maxCostPerRequest}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, maxCostPerRequest: parseFloat(e.target.value) }))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSourcesPerQuery" className="text-slate-300">
                  Max Sources Per Query
                </Label>
                <Input
                  id="maxSourcesPerQuery"
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxSourcesPerQuery}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, maxSourcesPerQuery: parseInt(e.target.value) }))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchTimeout" className="text-slate-300">
                  Search Timeout (ms)
                </Label>
                <Input
                  id="searchTimeout"
                  type="number"
                  min="1000"
                  max="30000"
                  value={settings.searchTimeout}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, searchTimeout: parseInt(e.target.value) }))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cacheTTL" className="text-slate-300">
                  Cache TTL (hours)
                </Label>
                <Input
                  id="cacheTTL"
                  type="number"
                  min="1"
                  max="24"
                  value={settings.cacheTTL}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, cacheTTL: parseInt(e.target.value) }))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rateLimitPerDay" className="text-slate-300">
                  Rate Limit Per Day
                </Label>
                <Input
                  id="rateLimitPerDay"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.rateLimitPerDay}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, rateLimitPerDay: parseInt(e.target.value) }))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Allowed Domains */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <Label className="text-slate-300">Allowed Domains</Label>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="Add allowed domain (e.g., .gov, example.com)"
                className="bg-slate-700 border-slate-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && addAllowedDomain()}
              />
              <Button onClick={addAllowedDomain} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {settings.allowedDomains.map((domain, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-green-900/50 text-green-300 border-green-700 flex items-center gap-1"
                >
                  {domain}
                  <button
                    onClick={() => removeAllowedDomain(domain)}
                    className="ml-1 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Blocked Domains */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <Label className="text-slate-300">Blocked Domains</Label>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newBlockedDomain}
                onChange={(e) => setNewBlockedDomain(e.target.value)}
                placeholder="Add blocked domain (e.g., t.me, pastebin.com)"
                className="bg-slate-700 border-slate-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && addBlockedDomain()}
              />
              <Button onClick={addBlockedDomain} size="sm" className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {settings.blockedDomains.map((domain, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-red-900/50 text-red-300 border-red-700 flex items-center gap-1"
                >
                  {domain}
                  <button
                    onClick={() => removeBlockedDomain(domain)}
                    className="ml-1 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-slate-700">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebResearchSettings;

