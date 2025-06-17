'use client'

import { Carousel } from '@mantine/carousel'
import { MantineProvider } from '@mantine/core'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import classes from '@/app/css/mantine.module.css'
import Text from '../Text/Text'

type Props = {
  listText: string[]
}

export const TextCarousel = (props: Props) => {
  const { listText } = props

  const autoplay = useRef(Autoplay({ delay: 5000 }))

  return (
    <MantineProvider
      withGlobalClasses
      withCssVariables
      withStaticClasses
    >
      <Carousel
        withIndicators
        height={400}
        slideGap={'xl'}
        classNames={classes}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        {listText.map((text, index) => (
          <Carousel.Slide key={index}>
            <Text
              text={text}
              styles="text-digiwhite2025-normal text-center !leading-8"
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </MantineProvider>
  )
}
