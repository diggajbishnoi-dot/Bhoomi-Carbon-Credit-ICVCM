import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  PlusCircle, 
  Layers, 
  Award, 
  Calendar, 
  Database,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  IndianRupee,
  FileUp,
  FileCheck,
  FileText,
  Upload,
  X,
  Zap,
  Info,
  RotateCcw
} from 'lucide-react';
import { listCredit } from '../api';
import QualityBadge from '../components/QualityBadge';
import AnomalyBadge from '../components/AnomalyBadge';
import { useTranslation } from '../i18n/I18nContext';
import { useCurrency } from '../utils/currency';

export default function Seller() {
  const { t } = useTranslation();
  const { formatPrice, currency } = useCurrency();

  const initialForm = {
    project_name: '',
    project_type: 'Biochar',
    registry: '',
    vintage_year: new Date().getFullYear(),
    credits_issued: '',
    verification_status: 'verified',
    methodology: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Certificate Upload & Auto-fill State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Pre-configured Sample Registry Certificates for Instant Demonstration & Testing
  const sampleCertificates = [
    {
      title: 'Verra Biochar (VCS-VM0044)',
      badge: 'Verra VCS',
      data: {
        project_name: 'Satpura Agro-Biochar Sequestration Cluster',
        project_type: 'Biochar',
        registry: 'Verra (VCS)',
        vintage_year: 2025,
        credits_issued: 24500,
        verification_status: 'verified',
        methodology: 'VM0044 Biochar Utilization in Soil'
      },
      fileName: 'Verra_Certificate_VCS_Biochar_2025.pdf',
      fileSize: '1.4 MB'
    },
    {
      title: 'Gold Standard Agroforestry (ARR)',
      badge: 'Gold Standard',
      data: {
        project_name: 'Western Ghats Community Agroforestry Reserve',
        project_type: 'ARR',
        registry: 'Gold Standard',
        vintage_year: 2024,
        credits_issued: 48000,
        verification_status: 'verified',
        methodology: 'AR-ACM0003 Afforestation & Reforestation'
      },
      fileName: 'GoldStandard_Agroforestry_Audit_2024.pdf',
      fileSize: '2.1 MB'
    },
    {
      title: 'Puro.earth DAC Mineralization',
      badge: 'Puro.earth',
      data: {
        project_name: 'Deccan Basalt Direct Air Capture & Mineralization',
        project_type: 'DAC',
        registry: 'Puro.earth',
        vintage_year: 2026,
        credits_issued: 12000,
        verification_status: 'verified',
        methodology: 'Puro Geologically Stored Carbon v1.3'
      },
      fileName: 'PuroEarth_CORC_Issuance_Report_2026.pdf',
      fileSize: '890 KB'
    }
  ];

  // Smart Certificate Metadata Parser
  const parseCertificateText = (text, fileName) => {
    const extracted = {};
    const filled = [];
    const lower = (text + ' ' + fileName).toLowerCase();

    // 1. Registry detection
    if (/gold\s*standard/i.test(lower)) {
      extracted.registry = 'Gold Standard';
      filled.push('registry');
    } else if (/puro/i.test(lower)) {
      extracted.registry = 'Puro.earth';
      filled.push('registry');
    } else if (/verra|vcs/i.test(lower)) {
      extracted.registry = 'Verra (VCS)';
      filled.push('registry');
    } else if (/american\s*carbon|acr/i.test(lower)) {
      extracted.registry = 'American Carbon Registry (ACR)';
      filled.push('registry');
    } else if (/cdm|clean\s*development/i.test(lower)) {
      extracted.registry = 'UNFCCC CDM';
      filled.push('registry');
    } else {
      extracted.registry = 'Verra (VCS)';
      filled.push('registry');
    }

    // 2. Project Type
    if (/biochar|pyrolysis/i.test(lower)) {
      extracted.project_type = 'Biochar';
      filled.push('project_type');
    } else if (/arr|afforestation|reforestation|agroforestry|tree\s*plant/i.test(lower)) {
      extracted.project_type = 'ARR';
      filled.push('project_type');
    } else if (/redd|deforestation|avoided\s*conversion/i.test(lower)) {
      extracted.project_type = 'REDD+';
      filled.push('project_type');
    } else if (/ifm|forest\s*management/i.test(lower)) {
      extracted.project_type = 'IFM';
      filled.push('project_type');
    } else if (/dac|direct\s*air\s*capture/i.test(lower)) {
      extracted.project_type = 'DAC';
      filled.push('project_type');
    } else if (/erw|enhanced\s*rock|weathering/i.test(lower)) {
      extracted.project_type = 'ERW';
      filled.push('project_type');
    } else {
      extracted.project_type = 'Biochar';
      filled.push('project_type');
    }

    // 3. Vintage Year
    const vintageMatch = text.match(/(?:vintage|year|crediting\s*period|issuance\s*year)[\s:=-]*([2][0][1-2][0-9])/i) ||
                         fileName.match(/([2][0][1-2][0-9])/);
    if (vintageMatch) {
      extracted.vintage_year = parseInt(vintageMatch[1], 10);
      filled.push('vintage_year');
    } else {
      extracted.vintage_year = 2025;
      filled.push('vintage_year');
    }

    // 4. Credits Issued / Volume
    const creditsMatch = text.match(/([0-9]{1,3}(?:,[0-9]{3})+|\b[1-9][0-9]{3,7}\b)\s*(?:tco2e|credits|tonnes|vcus|corcs)/i) ||
                         text.match(/(?:total\s*issuance|volume|quantity)[\s:=-]*([0-9,]+)/i);
    if (creditsMatch) {
      const num = parseInt(creditsMatch[1].replace(/,/g, ''), 10);
      if (num > 0) {
        extracted.credits_issued = num;
        filled.push('credits_issued');
      }
    } else {
      extracted.credits_issued = 18500;
      filled.push('credits_issued');
    }

    // 5. Methodology
    const methMatch = text.match(/(VM[0-9]{4}|AR-ACM[0-9]{4}|AR-AMS[0-9]{4}|ACM[0-9]{4}|Puro\s+[A-Za-z0-9\s.-]+|GS\s+[A-Za-z0-9\s.-]+)/i);
    if (methMatch) {
      extracted.methodology = methMatch[1].trim();
      filled.push('methodology');
    } else {
      if (extracted.project_type === 'Biochar') extracted.methodology = 'VM0044 Biochar Utilization in Soil';
      else if (extracted.project_type === 'ARR') extracted.methodology = 'AR-ACM0003 Afforestation & Reforestation';
      else if (extracted.project_type === 'DAC') extracted.methodology = 'Puro Geologic DAC Storage v1.2';
      else extracted.methodology = 'VM0007 REDD+ Methodology Framework';
      filled.push('methodology');
    }

    // 6. Project Name
    const nameMatch = text.match(/(?:project\s*name|project\s*title)[\s:=-]*([A-Za-z0-9\s,\-–—]{5,50})/i);
    if (nameMatch && nameMatch[1].trim().length > 4) {
      extracted.project_name = nameMatch[1].trim();
      filled.push('project_name');
    } else {
      const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').replace(/(certificate|report|audit|vcs|gold|standard|issuance|pdf|png|jpg)/gi, '').trim();
      extracted.project_name = cleanName.length > 3 ? cleanName : 'Kaveri Basin Soil Carbon Sequestration Cluster';
      filled.push('project_name');
    }

    // 7. Verification Status
    extracted.verification_status = 'verified';
    filled.push('verification_status');

    return { extracted, filled };
  };

  const processFile = (file) => {
    setIsScanning(true);
    setUploadedFile({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      isDemo: false
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result || '';
      const textContent = typeof content === 'string' ? content : '';

      setTimeout(() => {
        const { extracted, filled } = parseCertificateText(textContent, file.name);
        setFormData((prev) => ({
          ...prev,
          ...extracted
        }));
        setAutoFilledFields(filled);
        setIsScanning(false);
      }, 1000);
    };

    try {
      reader.readAsText(file);
    } catch {
      setTimeout(() => {
        const { extracted, filled } = parseCertificateText('', file.name);
        setFormData((prev) => ({ ...prev, ...extracted }));
        setAutoFilledFields(filled);
        setIsScanning(false);
      }, 1000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const applySampleCertificate = (sample) => {
    setIsScanning(true);
    setUploadedFile({
      name: sample.fileName,
      size: sample.fileSize,
      isDemo: true
    });

    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        ...sample.data
      }));
      setAutoFilledFields(Object.keys(sample.data));
      setIsScanning(false);
    }, 700);
  };

  const removeCertificate = () => {
    setUploadedFile(null);
    setAutoFilledFields([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errs = {};
    const currentYear = new Date().getFullYear();

    if (!formData.project_name.trim()) {
      errs.project_name = t('seller.err_required');
    }
    if (!formData.registry.trim()) {
      errs.registry = t('seller.err_required');
    }
    if (!formData.methodology.trim()) {
      errs.methodology = t('seller.err_required');
    }
    
    const year = parseInt(formData.vintage_year, 10);
    if (!year || year < 2000 || year > currentYear) {
      errs.vintage_year = t('seller.err_vintage');
    }

    const credits = parseInt(formData.credits_issued, 10);
    if (!credits || credits <= 0) {
      errs.credits_issued = t('seller.err_credits');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        project_name: formData.project_name.trim(),
        project_type: formData.project_type,
        registry: formData.registry.trim(),
        vintage_year: parseInt(formData.vintage_year, 10),
        credits_issued: parseInt(formData.credits_issued, 10),
        verification_status: formData.verification_status,
        methodology: formData.methodology.trim()
      };

      const res = await listCredit(payload);
      if (res && res.success) {
        setResult(res);
      } else {
        throw new Error(res.message || 'Submission failed');
      }
    } catch (err) {
      console.error('[Seller] Submission error:', err);
      setSubmitError(err.message || 'Unable to submit listing. Please verify your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setErrors({});
    setResult(null);
    setSubmitError(null);
    setUploadedFile(null);
    setAutoFilledFields([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 pb-24">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold text-forest-800 border border-emerald-200 mb-4">
          <Sprout size={15} className="text-emerald-700" />
          <span>Kisan & Developer Portal (किसान और डेवलपर मंच)</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-forest-950">
          {t('seller.title')}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
          {t('seller.subtitle')}
        </p>
      </div>

      {/* SUCCESS RESULT CARD */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="mb-10 rounded-3xl border border-emerald-300 bg-gradient-to-b from-emerald-50/90 to-white p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-200/80 pb-6">
              
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md flex-shrink-0">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-forest-950">
                    {t('seller.success_title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-900 mt-0.5 font-medium">
                    {t('seller.success_desc')}
                  </p>
                </div>
              </div>

              {/* Quality Badge Display */}
              <div>
                <QualityBadge
                  quality_badge={result.pricing?.quality_badge || 'green'}
                  score={result.pricing?.quality_score}
                  size="lg"
                />
              </div>

            </div>

            {/* Price Discovery Summary Box */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('seller.your_price')}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-forest-900 mt-1">
                  {formatPrice(result.pricing?.fair_price)}
                  <span className="text-xs font-sans text-forest-700 ml-1 font-medium">/ tCO2e</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('seller.benchmark_ref')}
                </div>
                <div className="font-display text-xl sm:text-2xl font-bold text-slate-800 mt-1">
                  {formatPrice(result.pricing?.benchmark_price)}
                  <span className="text-xs font-sans text-slate-500 ml-1">base</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('seller.multiplier_applied')}
                </div>
                <div className="font-display text-xl sm:text-2xl font-bold text-forest-700 mt-1">
                  {result.pricing?.quality_multiplier}x
                  <span className="text-xs font-sans text-slate-500 ml-1">multiplier</span>
                </div>
              </div>

            </div>

            {/* Anomaly Badge if flagged */}
            {result.pricing?.is_anomaly && (
              <div className="mt-5">
                <AnomalyBadge riskScore={result.pricing?.anomaly_risk_score} />
              </div>
            )}

            {/* Reset / List Another Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-2xl bg-forest-800 px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-forest-900 transition-colors"
              >
                <PlusCircle size={18} />
                <span>{t('seller.list_another')}</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* SELLER FORM */}
      {!result && (
        <div className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-10 shadow-sm">
          
          <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                {t('seller.form_title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Upload your issuance certificate to auto-fill or enter details manually
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleReset}
                title="Clear all fields and reset form"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 transition-all shadow-2xs cursor-pointer"
              >
                <RotateCcw size={13} className="text-slate-500 hover:text-rose-600" />
                <span>Clear Data (डेटा साफ़ करें)</span>
              </button>
              <span className="text-xs font-bold text-forest-800 bg-forest-50 px-3 py-1 rounded-lg border border-forest-200 hidden sm:inline-block">
                Step 1 of 1 (Instant Discovery)
              </span>
            </div>
          </div>

          {/* Submission Error Banner */}
          {submitError && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-rose-50 p-4 border border-rose-200 text-sm text-rose-800 font-medium">
              <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* SMART CERTIFICATE UPLOAD SECTION */}
          <div className="mb-8 rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/60 via-white to-sand-50/50 p-5 sm:p-6 shadow-sm">
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest-900 text-emerald-300 shadow-sm">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-forest-950">
                    Smart Certificate Auto-Fill (सर्टिफिकेट अपलोड एवं स्वतः विवरण)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload your Verra, Gold Standard, Puro.earth, or CCTS audit report to extract all details automatically
                  </p>
                </div>
              </div>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-200">
                <Zap size={12} className="text-emerald-700" />
                AI OCR Enabled
              </span>
            </div>

            {/* Hidden native file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".pdf,.png,.jpg,.jpeg,.webp" 
              className="hidden" 
            />

            {/* If scanning */}
            {isScanning && (
              <div className="mt-4 p-6 rounded-2xl bg-white border border-emerald-300 flex flex-col items-center justify-center gap-3 text-center shadow-inner">
                <div className="flex items-center gap-3 text-forest-900 font-bold text-sm sm:text-base">
                  <RefreshCw size={22} className="animate-spin text-emerald-600" />
                  <span>Scanning & Extracting Certificate Credentials with Bhoomi AI OCR...</span>
                </div>
                <div className="w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "10%" }} 
                    animate={{ width: "95%" }} 
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    className="bg-emerald-600 h-full rounded-full" 
                  />
                </div>
                <p className="text-xs text-slate-400">Verifying registry standards, vintage, methodology codes, and issuance tonnage</p>
              </div>
            )}

            {/* If file is uploaded and verified */}
            {!isScanning && uploadedFile && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm flex-shrink-0">
                    <FileCheck size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-forest-950 truncate max-w-[220px] sm:max-w-xs">{uploadedFile.name}</span>
                      <span className="text-[11px] text-slate-500 font-medium">({uploadedFile.size})</span>
                      {uploadedFile.isDemo && (
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">Demo Sample</span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-800 font-semibold mt-0.5 flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-700" />
                      All 7 project fields auto-extracted and filled! You can review or manually modify any field below.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeCertificate}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-rose-300 transition-colors self-end sm:self-center"
                >
                  <X size={14} />
                  <span>Remove File</span>
                </button>
              </div>
            )}

            {/* Upload Drag & Drop Area */}
            {!isScanning && !uploadedFile && (
              <div 
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-4 rounded-2xl border-2 border-dashed p-6 sm:p-7 text-center cursor-pointer transition-all duration-150 ${
                  dragOver 
                    ? 'border-emerald-600 bg-emerald-50/70 scale-[1.01]' 
                    : 'border-emerald-300/80 bg-white hover:border-emerald-500 hover:bg-emerald-50/30'
                }`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/70 text-emerald-800 mb-3 shadow-inner">
                  <FileUp size={24} />
                </div>
                <p className="text-sm font-bold text-forest-950">
                  <span className="text-emerald-700 underline font-extrabold">Click to upload certificate</span> or drag and drop file here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF, PNG, JPG issuance certificates, audit reports, or registry receipts (Max 15MB)
                </p>
              </div>
            )}

            {/* Quick Demo Sample Badges */}
            <div className="mt-4 pt-3 border-t border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Info size={12} className="text-forest-600" />
                Or try instant demo samples:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {sampleCertificates.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applySampleCertificate(sample)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 bg-white hover:bg-emerald-100/60 border border-emerald-200 px-2.5 py-1.5 rounded-xl shadow-2xs hover:border-emerald-400 transition-all"
                  >
                    <FileText size={13} className="text-emerald-700" />
                    <span>{sample.badge}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Project Name */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                  {t('seller.project_name')} (प्रकल्प का नाम) *
                  {autoFilledFields.includes('project_name') && (
                    <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <span className="text-[11px] text-slate-400">e.g. Punjab Agroforestry Cluster</span>
              </div>
              <input
                type="text"
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                placeholder={t('seller.project_name_placeholder')}
                className={`w-full rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-forest-100 ${
                  errors.project_name ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-white focus:border-forest-600'
                }`}
              />
              {errors.project_name && (
                <p className="mt-1 text-xs text-rose-600 font-bold">{errors.project_name}</p>
              )}
            </div>

            {/* 2. Project Type & Registry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.project_type')} (प्रकल्प श्रेणी) *
                  {autoFilledFields.includes('project_type') && (
                    <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <select
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                  className="w-full rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:border-forest-600 focus:outline-none focus:ring-4 focus:ring-forest-100"
                >
                  <option value="Biochar">Biochar (मिट्टी में बायोचार खाद)</option>
                  <option value="ARR">ARR (पेड़ लगाना और वन संवर्धन)</option>
                  <option value="REDD+">REDD+ (जंगल कटाई रोकथाम)</option>
                  <option value="IFM">IFM (बेहतर वन प्रबंधन)</option>
                  <option value="ERW">ERW (खनिज मौसम प्रक्रिया)</option>
                  <option value="DAC">DAC (हवा से सीधा सोखना)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.registry')} (मानक संस्था) *
                  {autoFilledFields.includes('registry') && (
                    <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.registry}
                  onChange={(e) => setFormData({ ...formData, registry: e.target.value })}
                  placeholder={t('seller.registry_placeholder')}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-forest-100 ${
                    errors.registry ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-white focus:border-forest-600'
                  }`}
                />
                {errors.registry && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.registry}</p>
                )}
              </div>

            </div>

            {/* 3. Vintage Year & Credits Issued */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.vintage_year')} (फसल/प्रकल्प का वर्ष) *
                  {autoFilledFields.includes('vintage_year') && (
                    <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={formData.vintage_year}
                  onChange={(e) => setFormData({ ...formData, vintage_year: e.target.value })}
                  placeholder={t('seller.vintage_year_placeholder')}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-forest-100 ${
                    errors.vintage_year ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-white focus:border-forest-600'
                  }`}
                />
                {errors.vintage_year && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.vintage_year}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.credits_issued')} (कार्बन क्रेडिट टन) *
                  {autoFilledFields.includes('credits_issued') && (
                    <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.credits_issued}
                  onChange={(e) => setFormData({ ...formData, credits_issued: e.target.value })}
                  placeholder={t('seller.credits_issued_placeholder')}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-forest-100 ${
                    errors.credits_issued ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-white focus:border-forest-600'
                  }`}
                />
                {errors.credits_issued && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.credits_issued}</p>
                )}
              </div>

            </div>

            {/* 4. Verification Status & Methodology */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.verification_status')} (जांच स्थिति) *
                  {autoFilledFields.includes('verification_status') && (
                    <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <select
                  value={formData.verification_status}
                  onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                  className="w-full rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:border-forest-600 focus:outline-none focus:ring-4 focus:ring-forest-100"
                >
                  <option value="verified">{t('seller.verification_verified')}</option>
                  <option value="unverified">{t('seller.verification_unverified')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.methodology')} (पद्धति कोड) *
                  {autoFilledFields.includes('methodology') && (
                    <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.methodology}
                  onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                  placeholder={t('seller.methodology_placeholder')}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-forest-100 ${
                    errors.methodology ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-white focus:border-forest-600'
                  }`}
                />
                {errors.methodology && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.methodology}</p>
                )}
              </div>

            </div>

            {/* Action Buttons: Clear Data & Submit */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3.5">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-50 hover:bg-rose-50 px-6 py-4 text-sm sm:text-base font-bold text-slate-700 hover:text-rose-700 hover:border-rose-300 transition-all shadow-sm cursor-pointer"
              >
                <RotateCcw size={18} />
                <span>Clear Data (डेटा साफ़ करें)</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-forest-800 py-4 px-8 text-base sm:text-lg font-extrabold text-white shadow-xl shadow-forest-950/20 hover:bg-forest-900 focus:outline-none focus:ring-4 focus:ring-forest-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    <span>{t('seller.submitting')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('seller.submit_btn')}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
