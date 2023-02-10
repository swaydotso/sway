import { styled } from 'themes'
import React from 'react'
import selectors from 'selectors'
import Icon from 'components/Icon'
import { Tooltip } from 'components/Tooltip'
// import { useSelector, useDispatch } from 'state'

interface Props {
  icon: string
  label: string
  onClick: () => void
  off?: boolean
  on?: boolean
  tooltipLabel?: string
  tooltipShortcut?: string[]
}

export function Button(props: Props) {
  // const dispatch = useDispatch()
  // const [] = useSelector((state) => [])

  return (
    <Tooltip content={props.tooltipLabel} shortcut={props.tooltipShortcut}>
      <Container onClick={props.onClick} off={props.off} on={props.on}>
        <Icon name={props.icon} />
      </Container>
    </Tooltip>
  )
}

export const Container = styled('div', {
  height: '100%',
  aspectRatio: '1',
  center: true,
  round: 'large',
  space: { inner: [0, 2], gap: 1 },
  //  border: '1px solid rgba(255, 255, 255, 0.01)',
  colors: {
    //    bg: '$dockButtonBg',
    fg: '$dockButtonFg',
  },
  '& svg': {
    width: '20px',
    height: '20px',
    margin: '0 auto',
    overflow: 'visible',
  },
  '&:hover': {
    background: '$dockButtonHoverBg',
    color: '$dockButtonHoverFg',
    borderColor: 'rgba(255, 255, 255, 0.03),',
  },
  variants: {
    off: {
      true: {
        color: '$dockButtonOffFg',
      },
    },
    on: {
      true: {
        color: '$dockButtonOnFg',
      },
    },
  },
})
