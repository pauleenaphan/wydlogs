import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import CategorySelect from "@/app/components/CategorySelect";
import Input from "@/app/components/Input";
import { authOptions } from "@/lib/auth";
import { endOfDay, startOfDay } from "@/lib/date-utils";
import { createLogs, editLogs, getLogs } from "@/lib/logs";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !("id" in session.user)) {
    redirect("/api/auth/signin");
  }
  const userId = session.user.id as string;
  const logs = await getLogs(userId, {
    from: startOfDay(),
    to: endOfDay(),
  });

  return (
    <div>
      <section>
        <p> tuesday, april 4 </p>
        <p> 3/8 logged - next reminder at 2pm </p>
        <div>
          <h1>Log</h1>
          <form action={createLogs}>
            <Input label="Ticket number" name="ticketNumber" required />
            <CategorySelect name="category" />
            <button type="submit">log</button>
          </form>
          <form action={createLogs}>
            <input type="hidden" name="duplicateLast" value="1" />
            <button type="submit">log same as last hour</button>
          </form>
        </div>
      </section>

      <section>
        <h2>Today&apos;s logs</h2>
        {logs.length === 0 ? (
          <p>No logs yet</p>
        ) : (
          <ul>
            {logs.map((log) => (
              <li key={log.id}>
                <p>{String(log.time)}</p>
                <form action={editLogs}>
                  <input type="hidden" name="id" value={log.id} />
                  <Input
                    label="Ticket number"
                    name="ticketNumber"
                    defaultValue={log.ticketNumber}
                    required
                  />
                  <CategorySelect
                    name="category"
                    defaultValue={log.category}
                  />
                  <button type="submit">Save</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
