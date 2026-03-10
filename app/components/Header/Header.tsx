'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import './header.css'

const SCROLL_THRESHOLD = 80

interface LeftLink {
  label?: string | null
  slug?: string | null
  title?: string | null
}

interface RightLink {
  label: string
  url: string
}

interface NavData {
  leftLinks?: LeftLink[] | null
  rightLinks?: RightLink[] | null
  mobileText?: PortableTextBlock[] | null
}

interface HeaderProps {
  nav: NavData | null
}

export default function Header({ nav }: HeaderProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const lastScrollY = useRef(0)
  const isHome = pathname === '/'
  const isStudio = pathname.startsWith('/studio')

  const leftLinks = nav?.leftLinks ?? []
  const rightLinks = nav?.rightLinks ?? []
  const mobileText = nav?.mobileText

  useEffect(() => {
    document.body.classList.toggle('body-menu-open', menuOpen)
    return () => document.body.classList.remove('body-menu-open')
  }, [menuOpen])

  useEffect(() => {
    document.body.classList.toggle('page--subpage', !isHome && !isStudio)
    return () => document.body.classList.remove('page--subpage')
  }, [isHome, isStudio])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < SCROLL_THRESHOLD) {
        setHeaderHidden(false)
      } else if (y > lastScrollY.current) {
        setHeaderHidden(true)
      } else {
        setHeaderHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMenu = () => setMenuOpen((o) => !o)
  const closeMenu = () => setMenuOpen(false)

  if (isStudio) return null

  return (
    <>
      <header
        className={`header${isHome ? ' header--home' : ''}${headerHidden ? ' header--hidden' : ''}`}
      >
        <div className="header__left header__nav">
          {leftLinks.map((item, i) =>
            item.slug ? (
              <Link
                key={i}
                href={`/${item.slug}`}
                className="header__link"
                onClick={closeMenu}
              >
                {item.label || item.title || 'Page'}
              </Link>
            ) : null
          )}
        </div>

        <div className="header__center">
          <Link href="/" className="header__logo-link" onClick={closeMenu} aria-label="Home">
            <svg className="header__logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 424 42" fill="none" aria-hidden>
              <path d="M228.321 1.22363C233.334 1.22364 236.488 1.95504 239.924 3.02539L240.374 9.33301H240.261C236.995 4.88405 233.221 2.85656 228.378 2.85645C219.029 2.85645 213.621 11.0792 213.621 21.5547C213.621 31.9741 219.422 40.366 228.884 40.3662C232.32 40.3662 234.911 39.6903 237.107 38.2822V32.3691C237.107 26.6243 236.882 24.9908 234.967 22.2871V22.2305H243.979V22.2871C242.12 24.9906 241.895 26.6245 241.895 32.3691V38.4512C238.853 40.1971 234.911 42 228.321 42C215.424 42 207.989 33.2134 207.989 21.7803C207.989 10.4598 216.043 1.22363 228.321 1.22363ZM316.86 1.22363C321.873 1.22366 325.027 1.95505 328.463 3.02539L328.913 9.33301H328.8C325.534 5.05276 321.76 3.13781 316.917 3.1377C307.568 3.1377 302.16 11.2479 302.16 21.5547C302.16 31.8049 307.792 40.0847 316.973 40.085C322.492 40.085 325.759 37.8876 328.856 33.0439H329.025L328.294 39.127C325.703 40.4784 322.38 42 316.86 42C303.963 42 296.528 33.1007 296.528 21.7803C296.528 10.4598 304.582 1.22363 316.86 1.22363ZM267.688 1.2793C271.181 1.2793 273.996 2.06791 275.968 2.7998L276.193 8.82617H276.138C273.209 5.22164 270.73 3.25105 266.731 3.25098C262.846 3.25098 259.747 5.2783 259.747 9.44531C259.747 13.6694 262.62 15.7545 267.351 18.2324C273.659 21.6114 277.939 24.3149 277.939 30.8477C277.939 37.1555 273.828 41.999 265.38 41.999C261.043 41.999 257.495 40.704 255.017 39.127L254.622 32.5371H254.679C257.438 36.7612 261.043 39.916 266.225 39.916C270.787 39.916 273.603 37.1558 273.603 33.1006C273.602 28.3697 270.392 26.1735 265.154 23.4141C259.353 20.3164 255.411 17.5559 255.411 11.6982C255.411 5.16544 260.48 1.27935 267.688 1.2793ZM351.907 1.22266C363.734 1.22266 371.563 10.0093 371.563 21.4424C371.563 32.9318 363.509 41.999 351.907 41.999C340.193 41.9988 332.252 33.157 332.252 21.668C332.252 10.1787 340.418 1.22291 351.907 1.22266ZM382.552 1.95508C380.243 5.39071 380.355 7.30616 382.664 14.1211L389.423 34.3398L396.913 11.0791L396.632 10.1787C395.055 5.504 394.492 4.20819 392.858 1.95508V1.89844H403.053V1.95508C400.744 5.39071 400.912 7.30608 403.165 14.0645L410.036 34.1709L416.513 14.1211C418.766 7.30616 418.822 5.39071 416.569 1.95508V1.89844H423.384V1.95508C421.694 4.20817 421.187 5.55977 419.667 10.2344L409.417 41.4932H407.39L397.927 13.8955L388.747 41.4932H386.606L376.074 10.1787C374.441 5.504 373.99 4.20819 372.301 1.95508V1.89844H382.552V1.95508ZM30.8643 7.64355H30.8076C26.922 4.71463 25.1193 3.53227 20.6133 3.53223H17.9668V31.1855C17.9668 36.9867 18.2476 38.5644 20.1064 41.2676V41.3242H10.8701V41.2676C12.7285 38.5644 12.9541 36.9867 12.9541 31.1855V3.53223H10.3076C5.80163 3.53223 3.99843 4.71458 0.0556641 7.64355H0L0.506836 1.89941H30.3574L30.8643 7.64355ZM199.667 32.875V12.0361C199.667 6.23588 199.442 4.65866 197.583 1.95508V1.89941H203.609V1.95508C201.751 4.6587 201.469 6.23584 201.469 12.0361V41.3242H199.61L173.984 8.09473V31.1855C173.984 36.9867 174.265 38.5644 176.124 41.2676V41.3242H170.099V41.2676C171.957 38.5644 172.182 36.9867 172.182 31.1855V12.0361C172.182 6.23585 171.957 4.65869 170.099 1.95508V1.89941H175.618L199.667 32.875ZM43.9014 1.95508C42.0425 4.65877 41.8174 6.23597 41.8174 12.0371V20.4844H62.4873V12.0371C62.4873 6.23597 62.2617 4.65877 60.4033 1.95508V1.89941H69.6396V1.95508C67.7808 4.65877 67.5566 6.23597 67.5566 12.0371V31.1855C67.5566 36.9869 67.7808 38.5644 69.6396 41.2676V41.3232H60.4033V41.2676C62.2617 38.5644 62.4873 36.9869 62.4873 31.1855V22.2305H41.8174V31.1855C41.8174 36.9869 42.0425 38.5644 43.9014 41.2676V41.3232H34.665V41.2676C36.5234 38.5644 36.748 36.9869 36.748 31.1855V12.0371C36.748 6.23599 36.5234 4.65875 34.665 1.95508V1.89941H43.9014V1.95508ZM99.8213 7.64355H99.7646C95.8785 4.71507 94.076 3.53223 89.5703 3.53223H82.249V19.8652H84.2764C90.0211 19.8652 91.6538 19.5834 94.3574 17.7246H94.4141V23.583H94.3574C91.6538 21.7242 90.0211 21.4424 84.2764 21.4424H82.249V34.6211C82.249 38.3944 82.6436 39.6904 85.0654 39.6904H90.9219C95.4277 39.6904 97.2301 38.5079 101.173 35.5791H101.229L100.723 41.3232H75.0957V41.2676C76.954 38.5639 77.1797 36.9867 77.1797 31.1855V12.0361C77.1797 6.23537 76.954 4.65821 75.0957 1.95508V1.89844H99.3145L99.8213 7.64355ZM129.396 1.95508C127.538 4.65877 127.257 6.23597 127.257 12.0371V20.9912L141.28 8.88281C145.166 5.50365 145.729 4.37687 144.49 1.95508V1.89941H151.756L131.368 19.4707L151.868 41.3232H141.675V41.2676C142.914 38.8462 142.462 37.6624 138.971 33.833L127.257 21.5557V31.1855C127.257 36.9869 127.538 38.5644 129.396 41.2676V41.3232H120.667V41.2676C122.526 38.5644 122.75 36.9869 122.75 31.1855V12.0371C122.75 6.23606 122.526 4.65869 120.667 1.95508V1.89941H129.396V1.95508ZM164.911 1.95508C162.997 4.65877 162.771 6.23597 162.771 12.0371V31.1855C162.771 36.9869 162.997 38.5644 164.911 41.2676V41.3232H155.844V41.2676C157.702 38.5644 157.927 36.9869 157.927 31.1855V12.0371C157.927 6.23597 157.702 4.65877 155.844 1.95508V1.89941H164.911V1.95508ZM351.683 3.08203C343.628 3.08203 337.883 10.6286 337.883 20.9912C337.883 32.1995 343.967 40.1406 352.189 40.1406C360.356 40.1404 366.157 32.6498 366.157 22.2305C366.157 11.079 360.075 3.08212 351.683 3.08203ZM253.42 0C252.626 5.03006 250.902 7.38821 248.255 10.0605H246.208C247.61 7.96814 249.814 3.86751 248.282 0H253.42Z" fill="currentColor"/>
            </svg>
          </Link>
        </div>

        <div className="header__right header__nav">
          {rightLinks.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="header__link"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="header__hamburger"
          aria-expanded={menuOpen}
          aria-controls="header-overlay"
          aria-label="Toggle menu"
          onClick={toggleMenu}
        >
          <span className="header__hamburger-line" />
          <span className="header__hamburger-line" />
          <span className="header__hamburger-line" />
        </button>
      </header>

      <div
        id="header-overlay"
        className="header__overlay"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
      >
        <div className="header__overlay-content">
          {leftLinks.map((item, i) =>
            item.slug ? (
              <Link
                key={i}
                href={`/${item.slug}`}
                className="header__link"
                onClick={closeMenu}
              >
                <span className="header__link-num">
                  {String(i + 1).padStart(2, '0')}
                </span>{' '}
                 <span className="header__link-text">{item.label || item.title || 'Page'}</span>
              </Link>
            ) : null
          )}
          {rightLinks.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="header__link"
              onClick={closeMenu}
            >
              <span className="header__link-num">
                {String(leftLinks.length + i + 1).padStart(2, '0')}
              </span>{' '}
              <span className="header__link-text">{item.label}</span>
            </a>
          ))}
          {mobileText && mobileText.length > 0 && (
            <div className="header__overlay-text">
              <PortableText value={mobileText} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}