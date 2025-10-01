"use client";
import SidebarStudent from "../../../components/dashboard/SidebarStudent";
import Topbar from "../../../components/dashboard/Topbar";
import { useEffect, useState } from "react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>("");
  const [permanentAddress, setPermanentAddress] = useState<string>("");
  const [residentialAddress, setResidentialAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [homeTown, setHomeTown] = useState<string>("");
  const [stateVal, setStateVal] = useState<string>("");
  const [lga, setLga] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [genotype, setGenotype] = useState<string>("");
  const [disability, setDisability] = useState<string>("");
  const [nokName, setNokName] = useState<string>("");
  const [nokAddress, setNokAddress] = useState<string>("");
  const [nokPhone, setNokPhone] = useState<string>("");
  const [nokEmail, setNokEmail] = useState<string>("");
  const [nokRelationship, setNokRelationship] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [dbStudent, setDbStudent] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fceo.currentUser");
      if (raw) {
        const u = JSON.parse(raw);
        setProfile(u);
        setAvatarDataUrl(u?.avatarDataUrl || "");
        setPermanentAddress(u?.permanentAddress || "");
        setResidentialAddress(u?.residentialAddress || "");
        setPhone(u?.phone || "");
        setEmailAddress(u?.email || "");
        setStateVal(u?.state || "");
        setLga(u?.lga || "");
        setHomeTown(u?.homeTown || "");
        setDateOfBirth(u?.dateOfBirth || "");
        setBloodGroup(u?.bloodGroup || "");
        setGenotype(u?.genotype || "");
        setDisability(u?.disability || "");
        setNokName(u?.nextOfKinName || "");
        setNokAddress(u?.nextOfKinAddress || "");
        setNokPhone(u?.nextOfKinPhone || "");
        setNokEmail(u?.nextOfKinEmail || "");
        setNokRelationship(u?.nextOfKinRelationship || "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const key = (profile?.regNo || "").toString().trim().toLowerCase();
        if (!key) return;
        let row: any = null;
        try {
          const list = await fetch("/api/students", { cache: "no-store" }).then((r) => r.json());
          if (Array.isArray(list)) {
            row = list.find((s: any) => (s?.regNo || "").toString().trim().toLowerCase() === key) || null;
          }
        } catch {}
        if (!row) {
          try {
            const raw = localStorage.getItem("fceo.students");
            if (raw) {
              const arr = JSON.parse(raw);
              if (Array.isArray(arr)) {
                row = arr.find((s: any) => (s?.regNo || "").toString().trim().toLowerCase() === key) || null;
              }
            }
          } catch {}
        }
        setDbStudent(row);
      } catch {}
    })();
  }, [profile?.regNo]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <SidebarStudent />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <h1 className="text-2xl md:text-3xl font-semibold">Profile</h1>
          {!profile ? (
            <div className="mt-6 text-sm">No profile found.</div>
          ) : (
            <form
              className="mt-6 grid gap-6 max-w-3xl"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const updated = {
                    ...profile,
                    avatarDataUrl: avatarDataUrl || undefined,
                    permanentAddress: permanentAddress || undefined,
                    residentialAddress: residentialAddress || undefined,
                    phone: phone || undefined,
                    email: emailAddress || undefined,
                    homeTown: homeTown || undefined,
                    state: stateVal || undefined,
                    lga: lga || undefined,
                    dateOfBirth: dateOfBirth || undefined,
                    bloodGroup: bloodGroup || undefined,
                    genotype: genotype || undefined,
                    disability: disability || undefined,
                    nextOfKinName: nokName || undefined,
                    nextOfKinAddress: nokAddress || undefined,
                    nextOfKinPhone: nokPhone || undefined,
                    nextOfKinEmail: nokEmail || undefined,
                    nextOfKinRelationship: nokRelationship || undefined,
                  };
                  // Persist to DB
                  const payload = {
                    regNo: profile?.regNo,
                    programme: profile?.programme || dbStudent?.programme || "",
                    ...updated,
                  };
                  await fetch("/api/students", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  // Mirror in localStorage for client display
                  localStorage.setItem("fceo.currentUser", JSON.stringify(updated));
                  setProfile(updated);
                  setMessage("Profile saved");
                  setTimeout(() => setMessage(""), 2000);
                } catch {}
              }}
            >
              <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5 p-4">
                <div className="font-semibold mb-3">School Record (read-only)</div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-xs mb-1">Reg No</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-zinc-100 text-black" value={dbStudent?.regNo || profile?.regNo || ""} readOnly disabled />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Surname</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-zinc-100 text-black" value={dbStudent?.surname || ""} readOnly disabled />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">First Name</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-zinc-100 text-black" value={dbStudent?.firstName || ""} readOnly disabled />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Middle Name</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-zinc-100 text-black" value={dbStudent?.middleName || ""} readOnly disabled />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Gender</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-zinc-100 text-black" value={dbStudent?.gender || ""} readOnly disabled />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">School</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-zinc-100 text-black" value={dbStudent?.school || ""} readOnly disabled />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Programme</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-zinc-100 text-black" value={dbStudent?.programme || ""} readOnly disabled />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5 p-4">
                <div className="font-semibold mb-3">Personal Details</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs mb-1">Avatar</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return setAvatarDataUrl("");
                        const reader = new FileReader();
                        reader.onload = () => setAvatarDataUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }}
                    />
                    {(avatarDataUrl || profile?.avatarDataUrl) && (
                      <div className="mt-2 w-16 h-16 rounded-full overflow-hidden ring-1 ring-black/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={avatarDataUrl || profile?.avatarDataUrl || ""} alt="Avatar preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Permanent Address</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Residential Address</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={residentialAddress} onChange={(e) => setResidentialAddress(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Phone</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Email</label>
                    <input type="email" className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Home Town</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={homeTown} onChange={(e) => setHomeTown(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Local Government</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={lga} onChange={(e) => setLga(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">State</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={stateVal} onChange={(e) => setStateVal(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Date of Birth</label>
                    <input type="date" className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5 p-4">
                <div className="font-semibold mb-3">Medical Records</div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-xs mb-1">Blood Group</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Genotype</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={genotype} onChange={(e) => setGenotype(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Disability</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={disability} onChange={(e) => setDisability(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5 p-4">
                <div className="font-semibold mb-3">Next of Kin Details</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs mb-1">Name</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={nokName} onChange={(e) => setNokName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Relationship</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={nokRelationship} onChange={(e) => setNokRelationship(e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs mb-1">Address</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={nokAddress} onChange={(e) => setNokAddress(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Phone</label>
                    <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={nokPhone} onChange={(e) => setNokPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Email</label>
                    <input type="email" className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={nokEmail} onChange={(e) => setNokEmail(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Reset to stored values
                    try {
                      const raw = localStorage.getItem("fceo.currentUser");
                      if (raw) {
                        const u = JSON.parse(raw);
                        setAvatarDataUrl(u?.avatarDataUrl || "");
                        setPermanentAddress(u?.permanentAddress || "");
                        setResidentialAddress(u?.residentialAddress || "");
                        setPhone(u?.phone || "");
                        setEmailAddress(u?.email || "");
                        setHomeTown(u?.homeTown || "");
                        setStateVal(u?.state || "");
                        setLga(u?.lga || "");
                        setDateOfBirth(u?.dateOfBirth || "");
                        setBloodGroup(u?.bloodGroup || "");
                        setGenotype(u?.genotype || "");
                        setDisability(u?.disability || "");
                        setNokName(u?.nextOfKinName || "");
                        setNokAddress(u?.nextOfKinAddress || "");
                        setNokPhone(u?.nextOfKinPhone || "");
                        setNokEmail(u?.nextOfKinEmail || "");
                        setNokRelationship(u?.nextOfKinRelationship || "");
                      }
                    } catch {}
                  }}
                  className="h-10 px-4 rounded border border-black/20 text-sm"
                >
                  Reset
                </button>
                <button type="submit" className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium">Save</button>
              </div>
              {message && <div className="text-sm text-green-700">{message}</div>}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}


