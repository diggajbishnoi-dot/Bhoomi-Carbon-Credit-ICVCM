import { useState } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, AlertCircle } from 'lucide-react';
import { useTranslation } from '../i18n/i18n.jsx';
import { postListing } from '../api.js';
import Reveal from '../components/Reveal.jsx';
import QualityBadge from '../components/QualityBadge.jsx';

const PROJECT_TYPES = ['REDD+', 'IFM', 'ARR', 'Biochar', 'ERW', 'DAC'];

const EMPTY_FORM = {
  project_name: '',
  project_type: 'REDD+',
  registry: '',
  vintage_year: '',
  credits_issued: '',
  verification_status: 'verified',
  methodology: '',
};

export default function ListCredit() {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [result, setResult] = useState(null);
  const [serverError, setServerError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e = {};
    const requiredFields = ['project_name', 'registry', 'vintage_year', 'credits_issued', 'methodology'];
    requiredFields.forEach((f) => {
      if (!String(form[f]).trim()) e[f] = t('listCredit.validationRequired');
    });
    const year = Number(form.vintage_year);
    if (form.vintage_year && (!Number.isInteger(year) || year < 1900 || year > 9999)) {
      e.vintage_year = t('listCredit.validationYear');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    setServerError('');
    try {
      const payload = {
        ...form,
        vintage_year: Number(form.vintage_year),
        credits_issued: Number(form.credits_issued),
      };
      const res = await postListing(payload);
      setResult(res.pricing || res);
      setStatus('success');
    } catch (err) {
      setServerError(err.message || 'Unknown error');
      setStatus('error');
    }
  }

  function reset() {
    setForm(EMPTY_FORM);
    setErrors({});
    setResult(null);
    setStatus('idle');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-semibold sm:text-4xl">{t('listCredit.title')}</h1>
        <p className="mt-2 max-w-xl text-forest-600">{t('listCredit.subtitle')}</p>
      </Reveal>

      {status === 'success' && result ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="card mt-8 text-center"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-500/15 text-leaf-600"
          >
            <PartyPopper size={26} />
          </motion.span>
          <h2 className="mt-4 text-xl font-semibold">{t('listCredit.successTitle')}</h2>
          <p className="mt-1 text-sm text-forest-500">{t('listCredit.successBody')}</p>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase text-forest-400">{t('listCredit.resultBadge')}</p>
              <div className="mt-2">
                <QualityBadge quality_badge={result.quality_badge} size="lg" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase text-forest-400">{t('listCredit.resultFairPrice')}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-forest-700">
                ₹{Number(result.fair_price_low ?? result.fair_price).toLocaleString('en-IN')} – ₹
                {Number(result.fair_price_high ?? result.fair_price).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <button onClick={reset} className="btn-secondary mt-8">
            {t('common.listAnother')}
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="card mt-8 space-y-5">
          <div>
            <label className="field-label">{t('listCredit.labelProjectName')}</label>
            <input
              className="field-input"
              value={form.project_name}
              placeholder={t('listCredit.placeholderProjectName')}
              onChange={(e) => update('project_name', e.target.value)}
            />
            {errors.project_name && <p className="mt-1 text-sm text-clay-600">{errors.project_name}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">{t('listCredit.labelProjectType')}</label>
              <select
                className="field-input"
                value={form.project_type}
                onChange={(e) => update('project_type', e.target.value)}
              >
                {PROJECT_TYPES.map((pt) => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">{t('listCredit.labelVerificationStatus')}</label>
              <select
                className="field-input"
                value={form.verification_status}
                onChange={(e) => update('verification_status', e.target.value)}
              >
                <option value="verified">{t('listCredit.verifiedOption')}</option>
                <option value="unverified">{t('listCredit.unverifiedOption')}</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">{t('listCredit.labelRegistry')}</label>
              <input
                className="field-input"
                value={form.registry}
                placeholder={t('listCredit.placeholderRegistry')}
                onChange={(e) => update('registry', e.target.value)}
              />
              {errors.registry && <p className="mt-1 text-sm text-clay-600">{errors.registry}</p>}
            </div>
            <div>
              <label className="field-label">{t('listCredit.labelVintageYear')}</label>
              <input
                type="number"
                className="field-input"
                value={form.vintage_year}
                onChange={(e) => update('vintage_year', e.target.value)}
              />
              {errors.vintage_year && <p className="mt-1 text-sm text-clay-600">{errors.vintage_year}</p>}
            </div>
          </div>

          <div>
            <label className="field-label">{t('listCredit.labelCreditsIssued')}</label>
            <input
              type="number"
              className="field-input"
              value={form.credits_issued}
              onChange={(e) => update('credits_issued', e.target.value)}
            />
            {errors.credits_issued && <p className="mt-1 text-sm text-clay-600">{errors.credits_issued}</p>}
          </div>

          <div>
            <label className="field-label">{t('listCredit.labelMethodology')}</label>
            <input
              className="field-input"
              value={form.methodology}
              placeholder={t('listCredit.placeholderMethodology')}
              onChange={(e) => update('methodology', e.target.value)}
            />
            {errors.methodology && <p className="mt-1 text-sm text-clay-600">{errors.methodology}</p>}
          </div>

          {status === 'error' && (
            <div className="flex items-start gap-2 rounded-xl bg-clay-500/10 p-4 text-sm text-clay-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{t('listCredit.errorTitle')}</p>
                <p>{serverError}</p>
              </div>
            </div>
          )}

          <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full sm:w-auto">
            {status === 'submitting' ? t('listCredit.submitting') : t('listCredit.submitButton')}
          </button>
        </form>
      )}
    </div>
  );
}
