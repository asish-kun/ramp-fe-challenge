import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading, clearCache } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string) => {
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId,
        }
      )

      setTransactionsByEmployee(data)
    },
    [fetchWithCache]
  )

  const updateTransaction = useCallback(
    (transactionId: string, newApprovalStatus: boolean) => {
      setTransactionsByEmployee((prevTransactions) =>
        prevTransactions?.map((transaction) =>
          transaction.id === transactionId
            ? { ...transaction, approved: newApprovalStatus }
            : transaction
        ) || null
      )
      // Clear the cache to ensure fresh data on next fetch
      clearCache()
    },
    [clearCache]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
    clearCache()
  }, [clearCache])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}
