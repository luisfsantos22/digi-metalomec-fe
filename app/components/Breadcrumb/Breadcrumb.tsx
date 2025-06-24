import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { classNames } from '@/utils'
import GenericTooltip from '../Tooltip/GenericTooltip'

interface BreadcrumbProps {
  paths: { name: string; href: string }[]
}

const Breadcrumb = (props: BreadcrumbProps) => {
  const { paths } = props

  return (
    <nav
      aria-label="breadcrumb"
      className="p-2"
    >
      <ol className="flex gap-1 items-center text-digiblack1212-bold">
        {paths.map((path, index) => {
          if (index === 0) {
            return (
              <li
                key={index}
                className="flex items-center gap-1"
              >
                <Link href={path.href}>
                  <div
                    className="flex flex-none h-4 w-4 items-start relative"
                    id="breadcrumb-home"
                  >
                    <Image
                      src={'/icons/home.svg'}
                      alt={'Home Image Breadcrumb'}
                      style={{ objectFit: 'contain' }}
                      fill
                      priority
                    />
                  </div>
                </Link>
                <GenericTooltip
                  text="Lista de Reparações"
                  anchorSelect="breadcrumb-home"
                  withArrow={false}
                  width="auto"
                />
                <span className="text-digibrown">/</span>
              </li>
            )
          }

          return (
            <li
              key={index}
              className={classNames(
                index < paths.length - 1 &&
                  'hover:underline hover:cursor-pointer hover:text-digiorange',
                ' flex items-center gap-1'
              )}
            >
              {index < paths.length - 1 ? (
                <Link href={path.href}>{path.name} /</Link>
              ) : (
                <span>
                  {path.name}
                  {index < paths.length - 1 ? ' /' : ''}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
