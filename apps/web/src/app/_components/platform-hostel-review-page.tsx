"use client";

import { Building2, FileText, ShieldQuestion } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { EmptyState, Panel, StatusBadge } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import { deferLoad, Hostel, Message, PageHeader } from "./core-portal-shared";

type PlatformHostelDocument = {
  createdAt: string | null;
  documentType: string;
  fileAssetId: string | null;
  fileUrl: string;
  id: string;
  rejectionReason: string;
  status: string;
};

type PlatformApplication = {
  id: string;
  infoRequestNote: string;
  rejectionReason: string;
  requestedDocuments: Array<{ documentType: string; note: string }>;
  status: string;
} | null;

type PlatformHostelDetail = {
  application: PlatformApplication;
  documents: PlatformHostelDocument[];
  hostel: Hostel;
};

// A FileAsset id routes through the secure, auth-gated presign endpoint, which
// 302-redirects the SUPERADMIN to a short-lived R2 URL. Legacy records that only
// stored a raw fileUrl fall back to that URL directly.
function documentHref(document: PlatformHostelDocument) {
  if (document.fileAssetId) {
    return `/api/v1/files/${document.fileAssetId}/url`;
  }
  return document.fileUrl || null;
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

export const PlatformHostelReviewPageContent = memo(function PlatformHostelReviewPageContent() {
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<PlatformHostelDetail | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await browserApi<PlatformHostelDetail>(
        `/api/v1/platform/hostels/${params.id}`,
      );

      setDetail(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load hostel.");
    }
  }, [params.id]);

  useEffect(() => deferLoad(load), [load]);

  const action = useCallback(
    async (nextAction: string) => {
      let body = JSON.stringify({});

      if (nextAction === "reject") {
        const reason = window.prompt("Rejection reason")?.trim();
        if (!reason) return;
        body = JSON.stringify({ reason });
      } else if (nextAction === "request-documents") {
        const raw = window.prompt(
          "Which documents are needed? Separate multiple with commas.\ne.g. Citizenship (clearer scan), Hostel license",
        );
        if (!raw) return;
        const documents = raw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .map((documentType) => ({ documentType }));
        if (documents.length === 0) return;
        const note =
          window.prompt("Optional message to the owner (leave blank to skip):") || undefined;
        body = JSON.stringify({ documents, note });
      }

      setBusy(true);
      try {
        await browserApi(`/api/v1/platform/hostels/${params.id}/${nextAction}`, {
          body,
          method: "PATCH",
        });
        setMessage(`Hostel ${nextAction} action completed.`);
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Action failed.");
      } finally {
        setBusy(false);
      }
    },
    [load, params.id],
  );

  const hostel = detail?.hostel ?? null;
  const documents = detail?.documents ?? [];
  const requestedDocuments = detail?.application?.requestedDocuments ?? [];

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <PageHeader
        description="Review owner-submitted documents, then approve, reject, or request more."
        icon={Building2}
        title="Hostel Verification"
      />
      <Message value={message} />

      {hostel ? (
        <>
          <Panel title={hostel.name}>
            <div className="grid gap-4 md:grid-cols-2">
              <p>Location: {hostel.location.address || hostel.location.area}</p>
              <p>Type: {hostel.hostelType}</p>
              <p>
                Status: <StatusBadge>{hostel.status}</StatusBadge>
              </p>
              <p>
                Verification: <StatusBadge>{hostel.verificationStatus}</StatusBadge>
              </p>
              <p>Phone: {hostel.contact?.phone || "-"}</p>
              <p>Email: {hostel.contact?.email || "-"}</p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{hostel.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {["approve", "reject", "request-documents", "publish", "unpublish"].map(
                (nextAction) => (
                  <button
                    className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-foreground disabled:opacity-50"
                    disabled={busy}
                    key={nextAction}
                    onClick={() => void action(nextAction)}
                    type="button"
                  >
                    {nextAction}
                  </button>
                ),
              )}
            </div>
          </Panel>

          <Panel title="Owner Documents">
            {documents.length === 0 ? (
              <EmptyState label="No documents were uploaded for this hostel." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground">
                    <tr>
                      <th className="py-2">Document</th>
                      <th>Status</th>
                      <th>Uploaded</th>
                      <th>File</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {documents.map((document) => {
                      const href = documentHref(document);
                      return (
                        <tr key={document.id}>
                          <td className="py-3">
                            <div className="flex items-center gap-2 font-medium text-foreground">
                              <FileText className="size-4 text-role-platform" />
                              {document.documentType}
                            </div>
                            {document.rejectionReason ? (
                              <p className="text-xs text-rose-500">
                                {document.rejectionReason}
                              </p>
                            ) : null}
                          </td>
                          <td>
                            <StatusBadge>{document.status}</StatusBadge>
                          </td>
                          <td className="whitespace-nowrap text-muted-foreground">
                            {formatTimestamp(document.createdAt) || "-"}
                          </td>
                          <td>
                            {href ? (
                              <a
                                className="font-semibold text-role-platform underline-offset-2 hover:underline"
                                href={href}
                                rel="noreferrer"
                                target="_blank"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-muted-foreground">No file</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          {requestedDocuments.length > 0 ? (
            <Panel title="Documents Requested From Owner">
              <ul className="space-y-2 text-sm">
                {requestedDocuments.map((document, index) => (
                  <li className="flex items-start gap-2" key={`${document.documentType}-${index}`}>
                    <ShieldQuestion className="mt-0.5 size-4 text-amber-500" />
                    <span>
                      <span className="font-medium text-foreground">
                        {document.documentType}
                      </span>
                      {document.note ? (
                        <span className="text-muted-foreground"> — {document.note}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </>
      ) : (
        <EmptyState label="Hostel detail is not loaded." />
      )}
    </div>
  );
});
