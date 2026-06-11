"use client";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCountries,
  getCountryName,
  getLocalGovernmentsForState,
  getStateName,
  getStatesForCountry,
} from "../../../lib/geo";
import { downloadAcknowledgmentSlip } from "../../../lib/admission/acknowledgment-slip";

const STAGES = [
  { id: 1, label: "Instructions" },
  { id: 2, label: "Personal Information" },
  { id: 3, label: "Program" },
  { id: 4, label: "Review & Submit" },
] as const;

type SchoolOption = {
  id: string;
  name: string;
};

type ProgramOption = {
  id: string;
  name: string;
  level: string;
  programType?: string;
  schoolId?: string | null;
  schoolName?: string | null;
};

const PROGRAM_TYPES = ["NCE", "Degree", "Post-Graduate"] as const;

type ApplicationData = {
  avatarDataUrl: string;
  surname: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  address: string;
  countryOfOrigin: string;
  stateOfOrigin: string;
  localGovernmentOfOrigin: string;
  homeTown: string;
  schoolId: string;
  programType: string;
  programme: string;
  programmeLabel: string;
};

const initialData: ApplicationData = {
  avatarDataUrl: "",
  surname: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  maritalStatus: "",
  address: "",
  countryOfOrigin: "",
  stateOfOrigin: "",
  localGovernmentOfOrigin: "",
  homeTown: "",
  schoolId: "",
  programType: "",
  programme: "",
  programmeLabel: "",
};

type SubmittedApplicant = {
  applicationNo: string;
  submittedAt: string;
  schoolName?: string | null;
  programName?: string | null;
  programType?: string | null;
};

function programmesStillValid(
  programs: ProgramOption[],
  programType: string,
  programmeId: string
): boolean {
  if (!programmeId) return true;
  const p = programs.find((item) => item.id === programmeId);
  if (!p) return false;
  const type = p.programType || p.level;
  if (programType && type !== programType) return false;
  return true;
}

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 mb-8">
      {STAGES.map((stage, index) => {
        const stepNum = index + 1;
        const isActive = current === stepNum;
        const isComplete = current > stepNum;
        return (
          <li key={stage.id} className="flex sm:flex-1 items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3 sm:flex-col sm:gap-2 sm:flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                  isActive
                    ? "bg-[rgb(3,158,29)] text-white"
                    : isComplete
                      ? "bg-[rgb(3,158,29)]/20 text-[rgb(3,158,29)]"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {isComplete ? "✓" : stepNum}
              </div>
              <span
                className={`text-xs sm:text-sm text-center font-medium ${
                  isActive ? "text-[rgb(3,158,29)]" : "text-slate-600"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {index < STAGES.length - 1 && (
              <div
                className={`hidden sm:block h-0.5 flex-1 mx-2 ${
                  isComplete ? "bg-[rgb(3,158,29)]" : "bg-slate-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function ApplicationFormPage() {
  const [stage, setStage] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [data, setData] = useState<ApplicationData>(initialData);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [schoolPrograms, setSchoolPrograms] = useState<ProgramOption[]>([]);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingSlip, setDownloadingSlip] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedApplicant, setSubmittedApplicant] = useState<SubmittedApplicant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLElement>(null);

  useEffect(() => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stage, submitted]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/schools", { cache: "no-store" });
        const list = await res.json();
        if (res.ok && Array.isArray(list)) {
          setSchools(list);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!data.schoolId) {
      setSchoolPrograms([]);
      return;
    }

    let cancelled = false;
    (async () => {
      setProgramsLoading(true);
      try {
        const res = await fetch(
          `/api/programs?schoolId=${encodeURIComponent(data.schoolId)}`,
          { cache: "no-store" }
        );
        const list = await res.json();
        if (!cancelled && res.ok && Array.isArray(list)) {
          setSchoolPrograms(list);
        } else if (!cancelled) {
          setSchoolPrograms([]);
        }
      } catch {
        if (!cancelled) setSchoolPrograms([]);
      } finally {
        if (!cancelled) setProgramsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data.schoolId]);

  const update = (fields: Partial<ApplicationData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const programmeOptions = useMemo(() => {
    return schoolPrograms
      .filter((p) => {
        if (!data.programType) return true;
        const type = p.programType || p.level;
        return type === data.programType;
      })
      .map((p) => ({
        value: p.id,
        label: p.name,
      }));
  }, [schoolPrograms, data.programType]);

  const selectedSchoolName = schools.find((s) => s.id === data.schoolId)?.name;

  const countries = useMemo(() => getCountries(), []);
  const stateOptions = useMemo(
    () => (data.countryOfOrigin ? getStatesForCountry(data.countryOfOrigin) : []),
    [data.countryOfOrigin]
  );
  const localGovernmentOptions = useMemo(
    () =>
      data.countryOfOrigin && data.stateOfOrigin
        ? getLocalGovernmentsForState(data.countryOfOrigin, data.stateOfOrigin)
        : [],
    [data.countryOfOrigin, data.stateOfOrigin]
  );

  const validateStage = (step: number): string | null => {
    if (step === 1 && !agreed) return "Please confirm that you have read the instructions.";
    if (step === 2) {
      if (!data.surname.trim()) return "Surname is required.";
      if (!data.firstName.trim()) return "First name is required.";
      if (!data.lastName.trim()) return "Last name is required.";
      if (!data.email.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return "Please enter a valid email address.";
      if (emailError) return emailError;
      if (!data.phone.trim()) return "Phone number is required.";
    }
    if (step === 3) {
      if (!data.schoolId) return "Please select a school.";
      if (!data.programType) return "Please select a program type.";
      if (!data.programme) return "Please select a programme.";
    }
    return null;
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return false;

    const res = await fetch(
      `/api/applicants/check-email?email=${encodeURIComponent(normalized)}`,
      { cache: "no-store" }
    );
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result?.error || "Could not verify email. Please try again.");
    }
    return Boolean(result.exists);
  };

  const verifyEmailForStage2 = async (): Promise<string | null> => {
    if (!data.surname.trim()) return "Surname is required.";
    if (!data.firstName.trim()) return "First name is required.";
    if (!data.lastName.trim()) return "Last name is required.";
    if (!data.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!data.phone.trim()) return "Phone number is required.";

    setCheckingEmail(true);
    try {
      const exists = await checkEmailExists(data.email);
      if (exists) {
        const message = "This email has already been used for an application.";
        setEmailError(message);
        return message;
      }
      setEmailError(null);
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not verify email. Please try again.";
      setEmailError(message);
      return message;
    } finally {
      setCheckingEmail(false);
    }
  };

  const goNext = async () => {
    if (stage === 2) {
      const err = await verifyEmailForStage2();
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setStage((s) => Math.min(s + 1, 4));
      return;
    }

    const err = validateStage(stage);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStage((s) => Math.min(s + 1, 4));
  };

  const goBack = () => {
    setError(null);
    setStage((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    const stage2Err = await verifyEmailForStage2();
    const err = stage2Err || validateStage(3);
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatarDataUrl: data.avatarDataUrl || null,
          surname: data.surname,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email.trim().toLowerCase(),
          phone: data.phone,
          gender: data.gender || null,
          dateOfBirth: data.dateOfBirth || null,
          maritalStatus: data.maritalStatus || null,
          address: data.address || null,
          countryOfOrigin: data.countryOfOrigin || null,
          stateOfOrigin: data.stateOfOrigin || null,
          localGovernmentOfOrigin: data.localGovernmentOfOrigin || null,
          homeTown: data.homeTown || null,
          schoolId: data.schoolId,
          programId: data.programme,
          programType: data.programType,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          const message = result?.error || "An application with this email already exists.";
          setEmailError(message);
          setStage(2);
          throw new Error(message);
        }
        throw new Error(result?.error || "Submission failed.");
      }
      setSubmittedApplicant({
        applicationNo: result.applicationNo,
        submittedAt: result.submittedAt || new Date().toISOString(),
        schoolName: result.schoolName ?? selectedSchoolName ?? null,
        programName: result.programName ?? data.programmeLabel ?? null,
        programType: result.programType ?? data.programType ?? null,
      });
      setSubmitted(true);
    } catch (submitErr: unknown) {
      setError(submitErr instanceof Error ? submitErr.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadAcknowledgment = async () => {
    if (!submittedApplicant || downloadingSlip) return;

    setDownloadingSlip(true);
    setError(null);
    try {
      await downloadAcknowledgmentSlip({
        applicationNo: submittedApplicant.applicationNo,
        submittedAt: submittedApplicant.submittedAt,
        surname: data.surname,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender || null,
        dateOfBirth: data.dateOfBirth || null,
        address: data.address || null,
        countryOfOrigin: getCountryName(data.countryOfOrigin) || null,
        stateOfOrigin: getStateName(data.countryOfOrigin, data.stateOfOrigin) || null,
        localGovernmentOfOrigin: data.localGovernmentOfOrigin || null,
        homeTown: data.homeTown || null,
        schoolName: submittedApplicant.schoolName,
        programType: submittedApplicant.programType,
        programName: submittedApplicant.programName,
        avatarDataUrl: data.avatarDataUrl || null,
      });
    } catch (downloadErr: unknown) {
      setError(
        downloadErr instanceof Error ? downloadErr.message : "Failed to download acknowledgment slip."
      );
    } finally {
      setDownloadingSlip(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[rgb(3,158,29)]/30 focus:border-[rgb(3,158,29)]";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      update({ avatarDataUrl: "" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update({ avatarDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Navbar />
      <section ref={formTopRef} className="max-w-4xl mx-auto px-6 py-10 scroll-mt-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Application Form</h1>
        <p className="text-slate-600 mt-2">
          Complete all four stages to submit your application to Federal College of Education, Ofeme Ohuhu.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
          <StepIndicator current={stage} />

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-[rgb(3,158,29)]/10 text-[rgb(3,158,29)] text-3xl grid place-items-center mx-auto mb-4">
                ✓
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Application Submitted</h2>
              <p className="text-slate-600 mt-2 max-w-md mx-auto">
                Your application has been received. Download your acknowledgment slip and submit required documents to the Admission Office.
              </p>
              {submittedApplicant && (
                <p className="mt-4 text-sm font-medium text-slate-800">
                  Application Number:{" "}
                  <span className="text-[rgb(3,158,29)]">{submittedApplicant.applicationNo}</span>
                </p>
              )}
              <button
                type="button"
                onClick={handleDownloadAcknowledgment}
                disabled={!submittedApplicant || downloadingSlip}
                className="inline-block mt-6 h-11 px-6 rounded-lg bg-[rgb(3,158,29)] text-white font-medium hover:bg-[rgb(2,110,20)] disabled:opacity-60 transition"
              >
                {downloadingSlip ? "Generating PDF..." : "Download Acknowledgment Slip (PDF)"}
              </button>
            </div>
          ) : (
            <>
              {/* Stage 1: Instructions */}
              {stage === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">Instructions</h2>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-5 text-sm text-slate-700 space-y-3">
                    <p>
                      Before you begin, ensure you have a valid email address and mobile phone number. You will use these to access your application portal.
                    </p>
                    <p>
                      On successful completion of your application, print a hard copy of your application form, acknowledgment slip, and evidence of payment.
                    </p>
                    <p>Attach photocopies of your credentials and submit to the Admission Office.</p>
                    <p className="font-medium text-slate-800">
                      Note: To apply for POST UTME SCREENING 2025/2026, select the corresponding programme in Stage 3.
                    </p>
                  </div>
                  <ol className="list-decimal pl-5 text-sm text-slate-600 space-y-1">
                    <li>Read all instructions carefully.</li>
                    <li>Fill in accurate personal information.</li>
                    <li>Select your preferred programme.</li>
                    <li>Review and submit your application.</li>
                  </ol>
                  <label className="flex items-start gap-3 text-sm text-slate-700 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[rgb(3,158,29)] focus:ring-[rgb(3,158,29)]"
                    />
                    I have read and understood the instructions above.
                  </label>
                </div>
              )}

              {/* Stage 2: Personal Information */}
              {stage === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>

                  <div className="flex flex-col items-center gap-2 pb-2">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[rgb(3,158,29)] hover:bg-[rgb(3,158,29)]/5 transition overflow-hidden group"
                      aria-label="Upload applicant photo"
                    >
                      {data.avatarDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={data.avatarDataUrl} alt="Applicant" className="w-full h-full object-cover" />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-slate-400 group-hover:text-[rgb(3,158,29)]">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      {data.avatarDataUrl && (
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <p className="text-xs text-slate-500">Upload applicant photo</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">Surname *</label>
                      <input className={inputClass} value={data.surname} onChange={(e) => update({ surname: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">First Name *</label>
                      <input className={inputClass} value={data.firstName} onChange={(e) => update({ firstName: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">Last Name *</label>
                      <input className={inputClass} value={data.lastName} onChange={(e) => update({ lastName: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">Gender</label>
                      <select className={inputClass} value={data.gender} onChange={(e) => update({ gender: e.target.value })}>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">Email *</label>
                      <input
                        className={`${inputClass}${emailError ? " border-red-300 focus:border-red-500 focus:ring-red-500/30" : ""}`}
                        type="email"
                        value={data.email}
                        onChange={(e) => {
                          setEmailError(null);
                          setError(null);
                          update({ email: e.target.value });
                        }}
                        onBlur={async (e) => {
                          const email = e.target.value.trim();
                          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
                          setCheckingEmail(true);
                          try {
                            const exists = await checkEmailExists(email);
                            if (exists) {
                              setEmailError("This email has already been used for an application.");
                            } else {
                              setEmailError(null);
                            }
                          } catch {
                            setEmailError("Could not verify email. Please try again.");
                          } finally {
                            setCheckingEmail(false);
                          }
                        }}
                        required
                      />
                      {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
                      {checkingEmail && !emailError && (
                        <p className="text-xs text-slate-500 mt-1">Checking email...</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">Mobile Phone *</label>
                      <input className={inputClass} value={data.phone} onChange={(e) => update({ phone: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">Date of Birth</label>
                      <input className={inputClass} type="date" value={data.dateOfBirth} onChange={(e) => update({ dateOfBirth: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">Marital Status</label>
                      <select className={inputClass} value={data.maritalStatus} onChange={(e) => update({ maritalStatus: e.target.value })}>
                        <option value="">Select marital status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1 font-medium text-slate-700">Residential Address</label>
                      <input className={inputClass} value={data.address} onChange={(e) => update({ address: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">Country of Origin</label>
                      <select
                        className={inputClass}
                        value={data.countryOfOrigin}
                        onChange={(e) =>
                          update({ countryOfOrigin: e.target.value, stateOfOrigin: "", localGovernmentOfOrigin: "" })
                        }
                      >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">State of Origin</label>
                      <select
                        className={inputClass}
                        value={data.stateOfOrigin}
                        disabled={!data.countryOfOrigin}
                        onChange={(e) => update({ stateOfOrigin: e.target.value, localGovernmentOfOrigin: "" })}
                      >
                        <option value="">
                          {data.countryOfOrigin ? "Select state" : "Select a country first"}
                        </option>
                        {stateOptions.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">Local Government of Origin</label>
                      <select
                        className={inputClass}
                        value={data.localGovernmentOfOrigin}
                        disabled={!data.stateOfOrigin}
                        onChange={(e) => update({ localGovernmentOfOrigin: e.target.value })}
                      >
                        <option value="">
                          {data.stateOfOrigin ? "Select local government" : "Select a state first"}
                        </option>
                        {localGovernmentOptions.map((lga) => (
                          <option key={lga} value={lga}>
                            {lga}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-medium text-slate-700">Home Town</label>
                      <input className={inputClass} value={data.homeTown} onChange={(e) => update({ homeTown: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}

              {/* Stage 3: Program */}
              {stage === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">Program</h2>
                  <p className="text-sm text-slate-600">Select your school, program type, and programme.</p>
                  <div>
                    <label className="block text-sm mb-1 font-medium text-slate-700">School *</label>
                    <select
                      className={inputClass}
                      value={data.schoolId}
                      onChange={(e) => {
                        const schoolId = e.target.value;
                        update({
                          schoolId,
                          programType: "",
                          programme: "",
                          programmeLabel: "",
                        });
                      }}
                      required
                    >
                      <option value="">Select school</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 font-medium text-slate-700">Program Type *</label>
                    <select
                      className={inputClass}
                      value={data.programType}
                      disabled={!data.schoolId || programsLoading}
                      onChange={(e) => {
                        const programType = e.target.value;
                        const stillValid = programmesStillValid(schoolPrograms, programType, data.programme);
                        update({
                          programType,
                          programme: stillValid ? data.programme : "",
                          programmeLabel: stillValid ? data.programmeLabel : "",
                        });
                      }}
                      required
                    >
                      <option value="">Select program type</option>
                      {PROGRAM_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 font-medium text-slate-700">Applying For *</label>
                    <select
                      className={inputClass}
                      value={data.programme}
                      disabled={!data.schoolId || programsLoading}
                      onChange={(e) => {
                        const selected = programmeOptions.find((p) => p.value === e.target.value);
                        const program = schoolPrograms.find((p) => p.id === e.target.value);
                        const type = program ? program.programType || program.level : "";
                        update({
                          programme: e.target.value,
                          programmeLabel: selected?.label || "",
                          programType: type || data.programType,
                        });
                      }}
                      required
                    >
                      <option value="">
                        {!data.schoolId
                          ? "Select a school first"
                          : programsLoading
                            ? "Loading programmes..."
                            : programmeOptions.length === 0
                              ? "No programmes available for this school"
                              : "Select programme"}
                      </option>
                      {programmeOptions.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {data.programme && (
                    <div className="rounded-lg bg-[rgb(3,158,29)]/5 border border-[rgb(3,158,29)]/20 p-4 text-sm text-slate-700">
                      <p className="font-medium text-slate-900">Selected programme</p>
                      <p className="mt-1">{data.programmeLabel}</p>
                      <p className="mt-1 text-slate-600">
                        {selectedSchoolName && `${selectedSchoolName} · `}
                        {data.programType}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Stage 4: Review & Submit */}
              {stage === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">Review Your Application</h2>
                  <p className="text-sm text-slate-600">Please confirm your details before submitting.</p>

                  <div className="rounded-lg border border-slate-200 divide-y divide-slate-200">
                    <div className="p-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Personal Information</h3>
                      {data.avatarDataUrl && (
                        <div className="mb-4 flex justify-center sm:justify-start">
                          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={data.avatarDataUrl} alt="Applicant" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}
                      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div><dt className="text-slate-500">Surname</dt><dd className="font-medium">{data.surname}</dd></div>
                        <div><dt className="text-slate-500">First Name</dt><dd className="font-medium">{data.firstName}</dd></div>
                        <div><dt className="text-slate-500">Last Name</dt><dd className="font-medium">{data.lastName}</dd></div>
                        <div><dt className="text-slate-500">Gender</dt><dd className="font-medium">{data.gender || "—"}</dd></div>
                        <div><dt className="text-slate-500">Email</dt><dd className="font-medium">{data.email}</dd></div>
                        <div><dt className="text-slate-500">Phone</dt><dd className="font-medium">{data.phone}</dd></div>
                        <div><dt className="text-slate-500">Date of Birth</dt><dd className="font-medium">{data.dateOfBirth || "—"}</dd></div>
                        <div><dt className="text-slate-500">Marital Status</dt><dd className="font-medium">{data.maritalStatus || "—"}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-slate-500">Address</dt><dd className="font-medium">{data.address || "—"}</dd></div>
                        <div><dt className="text-slate-500">Country of Origin</dt><dd className="font-medium">{getCountryName(data.countryOfOrigin) || "—"}</dd></div>
                        <div><dt className="text-slate-500">State of Origin</dt><dd className="font-medium">{getStateName(data.countryOfOrigin, data.stateOfOrigin) || "—"}</dd></div>
                        <div><dt className="text-slate-500">Local Government of Origin</dt><dd className="font-medium">{data.localGovernmentOfOrigin || "—"}</dd></div>
                        <div><dt className="text-slate-500">Home Town</dt><dd className="font-medium">{data.homeTown || "—"}</dd></div>
                      </dl>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Program</h3>
                      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div><dt className="text-slate-500">School</dt><dd className="font-medium">{selectedSchoolName || "—"}</dd></div>
                        <div><dt className="text-slate-500">Program Type</dt><dd className="font-medium">{data.programType || "—"}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-slate-500">Applying For</dt><dd className="font-medium">{data.programmeLabel || "—"}</dd></div>
                      </dl>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={stage === 1 || submitting}
                  className="h-11 px-5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Back
                </button>
                {stage < 4 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={checkingEmail || submitting}
                    className="h-11 px-6 rounded-lg bg-[rgb(3,158,29)] text-white font-medium hover:bg-[rgb(2,110,20)] disabled:opacity-70 transition flex items-center gap-2"
                  >
                    {checkingEmail && stage === 2 && (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    )}
                    {checkingEmail && stage === 2 ? "Checking email..." : "Continue"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="h-11 px-6 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-70 transition flex items-center gap-2"
                  >
                    {submitting && (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    )}
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
