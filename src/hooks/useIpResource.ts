"use client"

import { useMemo, useState } from "react";

export async function useIpResource(sourceName: string) {
  const [state, setState] = useState<any>(undefined)
  if (sourceName == 'ip138') {
  }
  if (sourceName == 'maximind') {
    
  }
  if (sourceName == 'dpip') {
    
  }
  
  return useMemo(() => state, [state])
}