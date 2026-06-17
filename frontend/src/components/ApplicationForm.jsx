import { useState } from "react";

const JOB_TYPES = ["Internship", "Full-time", "Part-time"];
const STATUSES = ["Applied", "Interviewing", "Offer", "Rejected"];

const emptyForm = {
  company_name: "",
  job_title: "",
  job_type: "Internship",
  status: "Applied",
  applied_date: "",
  notes: "",
};

function buildInitialState(initialData) {
  if (!initialData) return emptyForm;
  return {
    company_name: initialData.company_name || "",
    job_title: initialData.job_title || "",
    job_type: initialData.job_type || "Internship",
    status: initialData.status || "Applied",
    applied_date: initialData.applied_date
      ? initialData.applied_date.slice(0, 10)
      : "",
    notes: initialData.notes || "",
  };
}

export default function ApplicationForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save application",
}) {
  // Lazy initializer reads initialData once on mount. The parent passes a
  // `key` tied to the application id, so React remounts (and re-initializes)
  // this form whenever a different application is being edited.
  const [form, setForm] = useState(() => buildInitialState(initialData));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!form.company_name.trim() || form.company_name.trim().length < 2) {
      next.company_name = "Enter at least 2 characters.";
    }
    if (!form.job_title.trim()) {
      next.job_title = "Job title is required.";
    }
    if (!form.applied_date) {
      next.applied_date = "Pick the date you applied.";
    }
    return next;
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        company_name: form.company_name.trim(),
        job_title: form.job_title.trim(),
        notes: form.notes.trim() || null,
      });
    } catch (err) {
      if (err.details) {
        setErrors(err.details);
      } else {
        setErrors({
          _general: err.message || "Something went wrong. Try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {errors._general && (
        <div className="app-form__general-error">{errors._general}</div>
      )}

      <div className="app-form__row">
        <label htmlFor="company_name">Company name</label>
        <input
          id="company_name"
          type="text"
          value={form.company_name}
          onChange={(e) => handleChange("company_name", e.target.value)}
          placeholder="e.g. Acme Corp"
          aria-invalid={!!errors.company_name}
        />
        {errors.company_name && (
          <span className="app-form__error">{errors.company_name}</span>
        )}
      </div>

      <div className="app-form__row">
        <label htmlFor="job_title">Job title</label>
        <input
          id="job_title"
          type="text"
          value={form.job_title}
          onChange={(e) => handleChange("job_title", e.target.value)}
          placeholder="e.g. Frontend Developer Intern"
          aria-invalid={!!errors.job_title}
        />
        {errors.job_title && (
          <span className="app-form__error">{errors.job_title}</span>
        )}
      </div>

      <div className="app-form__row app-form__row--split">
        <div>
          <label htmlFor="job_type">Job type</label>
          <select
            id="job_type"
            value={form.job_type}
            onChange={(e) => handleChange("job_type", e.target.value)}
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="app-form__row">
        <label htmlFor="applied_date">Applied date</label>
        <input
          id="applied_date"
          type="date"
          value={form.applied_date}
          onChange={(e) => handleChange("applied_date", e.target.value)}
          aria-invalid={!!errors.applied_date}
        />
        {errors.applied_date && (
          <span className="app-form__error">{errors.applied_date}</span>
        )}
      </div>

      <div className="app-form__row">
        <label htmlFor="notes">
          Notes <span className="app-form__optional">optional</span>
        </label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Referral, interview prep, follow-up reminders..."
          rows={3}
        />
      </div>

      <div className="app-form__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting}
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
