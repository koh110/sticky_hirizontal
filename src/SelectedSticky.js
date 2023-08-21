import { useEffect, useRef, useState } from 'react'

const menu = Array.from({ length: 15 }, (_, i) => i + 1)

const popupHeight = '100px'
const popupWidth = '150px'

function Popup({ val, styles }) {
  return (
    <div
      style={{
        position: 'sticky',
        left: 0,
        top: `-${popupHeight}`,
        minWidth: popupWidth,
        height: popupHeight,
        backgroundColor: 'rgba(255, 0, 0, 1)',
        ...styles
      }}
    >popup {val}</div>
  )
}

function MenuItems({ val, isSelected, isPrevIntersecting, onObserve }) {
  const ref = useRef(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (val === 5) {
          console.log(val, isSelected, entry.isIntersecting)
        }
        setIsIntersecting(entry.isIntersecting)
        onObserve(entry.isIntersecting)
      },
      {
        root: document.querySelector('#intersection-root2'),
        rootMargin: `0px`,
        thresholds: [0]
      }
    )
    observer.observe(ref.current)

    return () => {
      observer?.disconnect()
    }
  }, [ref])

  const showPopup = (() => {
    if (isPrevIntersecting && isSelected && isIntersecting) {
      return true
    }
    return false
  })()

  return (
    <div
      style={{
        border: 'green 1px solid',
        position: 'relative',
        maxWidth: '100px',
      }}
    >
      <Popup val={val} styles={{ opacity: showPopup ? 1 : 0 }} />
      <div
        ref={ref}
        style={{
          backgroundColor: isSelected ? 'rgb(0, 0, 255)' : '#282c34',
          maxWidth: '100px',
          height: '100px',
          border: 'white 1px solid'
        }}
      >{val}</div>
    </div>
  )
}

export default function SelectedSticky() {
  const [items, setItems] = useState(() => {
    return menu.map((e) => {
      return {
        val: e,
        isSelected: false,
        isPrevIntersecting: false,
        isIntersecting: false
      }
    })
  })

  const selectedItem = items.find((e) => e.isSelected)
  const leftOpacity = (() => {
    if (!selectedItem) return 0.2
    if (selectedItem.isPrevIntersecting && selectedItem.isIntersecting) {
      return 0.2
    }
    return 1
  })()
  return (
    <>
      <div className="contents">contents</div>
      <div style={{
        padding: '0 1em'
      }}>
        <div
          id="intersection-root2"
          style={{
            position: 'relative',
            display: 'flex',
            overflowX: 'scroll',
            maxWidth: '100%',
            margin: `-${popupHeight} 0 0 0`,
            color: 'white',
          }}
        >
          <Popup
            val={selectedItem?.val}
            styles={{
              top: 0,
              left: 0,
              opacity: leftOpacity
            }}
          />
          {items.map((e, i) => {
            return (
              <div
                style={{
                  marginLeft: i === 0 ? `-${popupWidth}` : 0
                }}
                key={e.val}
                onClick={() => {
                  setItems((prev) => {
                    return prev.map((item, j) => {
                      return { ...item, isSelected: i === j }
                    })
                  })
                }}
              >
                <MenuItems
                  val={e.val}
                  isSelected={e.isSelected}
                  isPrevIntersecting={e.isPrevIntersecting}
                  onObserve={(isIntersecting) => {
                    setItems((prev) => {
                      if (prev[i + 1]) {
                        prev[i + 1].isPrevIntersecting = isIntersecting
                      }
                      prev[i].isIntersecting = isIntersecting
                      return [ ...prev ]
                    })
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
