import { createFileRoute } from "@tanstack/react-router";
import { getAllEnquiriesForExport } from "@/lib/server/enquiry-store";
import { buildAllEnquiriesExcelBuffer } from "@/lib/server/excel";

export const Route = createFileRoute("/api/export-excel")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const enquiries = getAllEnquiriesForExport();
          const buffer = await buildAllEnquiriesExcelBuffer(enquiries);

          return new Response(new Uint8Array(buffer), {
            status: 200,
            headers: {
              "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "Content-Disposition":
                'attachment; filename="Aurelian_Enquiries_Master.xlsx"',
              "Cache-Control": "no-store",
            },
          });
        } catch (err: any) {
          return new Response(
            JSON.stringify({
              ok: false,
              error: err?.message || "Failed to generate Excel file.",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
