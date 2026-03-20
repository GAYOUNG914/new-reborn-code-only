"use client"

import { ReactNode, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { initLenis } from '@/utils/lenis'

function LenisProvider({ children }: { children: ReactNode }) {

  useEffect(() => {
    const initLenisCallback = async () => {
      await initLenis()
    }

    initLenisCallback()
  }, [])

  return <>{children}</>
}

// 클라이언트 사이드에서만 렌더링되도록 설정
export default dynamic(() => Promise.resolve(LenisProvider), {
  ssr: false
})