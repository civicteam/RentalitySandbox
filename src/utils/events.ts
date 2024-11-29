import { EventLog } from "ethers";
import { Listener } from "ethers";
import { Log } from "ethers";
import { Contract } from "ethers";
import { bigIntReplacer } from ".";

function isEventLog(log: EventLog | Log): log is EventLog {
  return (log as EventLog).args !== undefined;
}

function createEventListener(
  setFoundEvents: React.Dispatch<
    React.SetStateAction<
      {
        eventType: number;
        tripId: number;
        tripStatus: number;
      }[]
    >
  >
): Listener {
  return async ({ args }) => {
    console.log(`Rentality Event | args: ${JSON.stringify(args, bigIntReplacer)}`);
    setFoundEvents((prev) => [
      ...prev,
      { eventType: Number(args[0]), tripId: Number(args[1]), tripStatus: Number(args[2]) },
    ]);
  };
}

export async function subscribeToEvents(
  notificationService: Contract,
  latestBlockNumber: number,
  setFoundEvents: React.Dispatch<
    React.SetStateAction<
      {
        eventType: number;
        tripId: number;
        tripStatus: number;
      }[]
    >
  >,
  setStatus: React.Dispatch<React.SetStateAction<string>>
) {
  if (!notificationService) {
    console.error("subscribeToEvents error: notificationService is null");
    return;
  }

  try {
    const toBlock = latestBlockNumber;
    const fromBlock = toBlock - 1000;

    const rentalityEventFilter = notificationService.filters.RentalityEvent(null, null, null, null, null, null);

    const rentalityEventHistory = (await notificationService.queryFilter(rentalityEventFilter, fromBlock, toBlock))
      .filter(isEventLog)
      .map((i) => ({ eventType: Number(i.args[0]), tripId: Number(i.args[1]), tripStatus: Number(i.args[2]) }));

    setFoundEvents(rentalityEventHistory);

    await notificationService.removeAllListeners();
    await notificationService.on(rentalityEventFilter, createEventListener(setFoundEvents));
    setStatus("Subscribed successfully");
  } catch (e) {
    console.error("subscribeToEvents error:" + e);
  }
}
