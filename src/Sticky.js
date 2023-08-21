import { useEffect, useRef, useState } from 'react'

const menu = Array.from({ length: 10 }, (_, i) => i + 1)

function MenuItems({ val, prevIsIntersecting, onObserve }) {
  const ref = useRef(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        onObserve(entry.isIntersecting)
      },
      {
        root: document.querySelector('#intersection-root'),
        rootMargin: '0px 0px 0px -80px',
        thresholds: [0]
      }
    )
    observer.observe(ref.current)

    return () => {
      observer?.disconnect()
    }
  }, [ref])

  const showPopup = (() => {
    if (prevIsIntersecting) {
      return false
    }
    return isIntersecting
  })()

  return (
    <div className="item">
      <div
        ref={ref}
        style={{
          position: 'sticky',
          left: 0,
          top: '-100px',
          width: '80px',
          height: '100px',
          backgroundColor: showPopup ? 'rgba(255, 0, 0, 0.5)' : ''
        }}
      >popup {val} ({showPopup ? 'visible' : 'hidden'}) </div>
      <div className="item-value">{val}</div>
    </div>
  )
}

export default function Sticky() {
  const [items, setItems] = useState(() => {
    return menu.map((e) => {
      return {
        val: e,
        isIntersecting: false
      }
    })
  })

  return (
    <>
      <div className="contents">contents</div>
      <div className="item-wrap" id="intersection-root">
        {items.map((e, i) => {
          return (
            <MenuItems
              key={e.val}
              val={e.val}
              prevIsIntersecting={i === 0 ? false : items[i - 1].isIntersecting}
              onObserve={(isIntersecting) => {
                setItems((prev) => {
                  prev[i].isIntersecting = isIntersecting
                  return [ ...prev ]
                })
              }}
            />
          )
        })}
      </div>
    </>
  )
}
