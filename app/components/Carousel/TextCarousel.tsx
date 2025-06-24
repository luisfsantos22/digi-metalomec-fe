'use client'

import { Carousel } from '@mantine/carousel'
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
    <Carousel
      withIndicators
      withControls={false}
      height={200}
      slideGap="xl"
      align="center"
      loop
      classNames={{
        root: classes.root,
        indicator: classes.indicator,
        control: classes.control,
        slide: classes.slide,
      }}
      plugins={[autoplay.current]}
      onMouseEnter={() => autoplay.current.stop()}
      onMouseLeave={() => autoplay.current.reset()}
    >
      {listText.map((text, index) => (
        <Carousel.Slide key={index}>
          <Text
            text={text}
            styles="text-digiwhite2432-normal text-center !leading-8"
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}
