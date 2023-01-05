import { styled } from 'themes'
import React, { useEffect, useRef } from 'react'
import selectors from 'selectors'
import { useMediaTrack } from '@daily-co/daily-react-hooks'
import logger from 'lib/log'
// import { useSelector, useDispatch } from 'state'

interface Props {
  id: string
}

const log = logger('video')

export default function Video(props: Props) {
  // const dispatch = useDispatch()
  // const [] = useSelector((state) => [])
  const track = useMediaTrack(props.id, 'video')
  const el = useRef<HTMLVideoElement>()

  useEffect(() => {
    const video = el.current
    log.info('Video track', { user: props.id })

    if (!video || !track?.persistentTrack) return
    /*  The track is ready to be played. We can show video of the participant in the UI. */

    video.srcObject = new MediaStream([track?.persistentTrack])
  }, [track?.persistentTrack])

  if (!el) return <Blank />

  return <Player autoPlay muted playsInline ref={el} />
}

const Player = styled('video', {
  width: '100%',
  background: 'rgba(0, 0, 0, 0.2)',
})

const Blank = styled('div', {})
