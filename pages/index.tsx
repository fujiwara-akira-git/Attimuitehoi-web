import { useState } from 'react'

function Confetti({ show }: { show: boolean }) {
  if (!show) return null
  const pieces = Array.from({ length: 24 })
  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {pieces.map((_, i) => {
        const left = 20 + Math.random() * 60
        const delay = Math.random() * 400
        const color = ['#ff6fa0','#ffd166','#6fd3ff','#b1ffb8'][i % 4]
        const style: any = {
          position: 'absolute', left: `${left}%`, top: '-10%', width: 8, height: 12, background: color, transform: `rotate(${Math.random()*360}deg)`, animation: `fall 1.4s ${delay}ms forwards`}
        return <div key={i} style={style} />
      })}
      <style>{`@keyframes fall { to { transform: translateY(140%) rotate(360deg); opacity: 0.9; } }`}</style>
    </div>
  )
}

enum Janken { Gu = 'グー', Choki = 'チョキ', Pa = 'パー' }
enum Dir { Left = '左', Right = '右' }

export default function Home() {
  const [status, setStatus] = useState('じゃんけんを選んでください')
  const [playerHand, setPlayerHand] = useState<Janken | null>(null)
  const [cpuHand, setCpuHand] = useState<Janken | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  function speak(text: string) {
    if (typeof window === 'undefined') return
    const synth = window.speechSynthesis
    const ut = new SpeechSynthesisUtterance(text)
    ut.lang = 'ja-JP'
    synth.cancel()
    synth.speak(ut)
  }

  function playJanken(p: Janken) {
    setPlayerHand(p)
    const choices = [Janken.Gu, Janken.Choki, Janken.Pa]
    const cpu = choices[Math.floor(Math.random() * 3)]
    setCpuHand(cpu)
    setStatus('あっち向いてほいへ！ 指差す方を選んでください')
    speak(`${p}、${cpu}。あっち向いてほい！`)
  }

  function point(d: Dir) {
    const dirs = [Dir.Left, Dir.Right]
    const cpu = dirs[Math.floor(Math.random() * 2)]
    if (playerHand === null || cpuHand === null) {
      setStatus('じゃんけんを先にしてください')
      return
    }
    const playerWon = (() => {
      if (playerHand === cpuHand) return false
      return (playerHand === Janken.Gu && cpuHand === Janken.Choki) ||
        (playerHand === Janken.Choki && cpuHand === Janken.Pa) ||
        (playerHand === Janken.Pa && cpuHand === Janken.Gu)
    })()

    if (playerWon) {
      if ((d === Dir.Left && cpu === Dir.Left) || (d === Dir.Right && cpu === Dir.Right)) {
        setStatus('プレイヤーの勝ち！')
        speak('勝ち！')
        setShowConfetti(true)
        setTimeout(()=>setShowConfetti(false), 2000)
      } else {
        setStatus('外れ。じゃんけんからやり直し')
        speak('外れました。じゃんけんからやり直し。')
      }
    } else {
      if ((d === Dir.Left && cpu === Dir.Left) || (d === Dir.Right && cpu === Dir.Right)) {
        setStatus('プレイヤーの負け...')
        speak('負けです')
      } else {
        setStatus('外れ。じゃんけんからやり直し')
        speak('外れました。じゃんけんからやり直し。')
      }
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>あっちむいてほい（Web）</h1>
      <p>{status}</p>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <div>あなた</div>
          <div style={{ fontSize: 48 }}>{playerHand ? (playerHand === Janken.Gu ? '✊' : playerHand === Janken.Choki ? '✌️' : '🖐️') : '—'}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div>CPU</div>
          <div style={{ width: 140, height: 140, margin: '0 auto' }}>
            <img src="/cpu.svg" alt="CPU キャラクター" style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ fontSize: 48, marginTop: 6 }}>{cpuHand ? (cpuHand === Janken.Gu ? '✊' : cpuHand === Janken.Choki ? '✌️' : '🖐️') : '—'}</div>
        </div>
      </div>

      <h2 style={{ marginTop: 20 }}>じゃんけん</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <button onClick={() => playJanken(Janken.Gu)}>グー</button>
        <button onClick={() => playJanken(Janken.Choki)}>チョキ</button>
        <button onClick={() => playJanken(Janken.Pa)}>パー</button>
      </div>

      <h2 style={{ marginTop: 20 }}>指差し</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <button onClick={() => point(Dir.Left)}>左</button>
        <button onClick={() => point(Dir.Right)}>右</button>
      </div>

      <div style={{ marginTop: 24 }}>
        <button onClick={() => { setPlayerHand(null); setCpuHand(null); setStatus('じゃんけんを選んでください'); }}>リセット</button>
      </div>
    </main>
  )
}
