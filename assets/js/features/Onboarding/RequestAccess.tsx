import { styled } from 'themes'
import React, { useEffect, useState } from 'react'
import {
  StepContent,
  StepDesc,
  StepGrid,
  StepSection,
  StepTitle,
} from 'components/Onboarding'
import { CurrentStep } from './CurrentStep'
import { Device } from 'components/Onboarding/Device'
import { logger } from 'lib/log'
import { OnboardingButtonset } from 'components/Onboarding/Buttonset'
import { getDefaultDevices, getUserDevices } from 'lib/devices'
import { useDispatch } from 'state'
import {
  setAudioInputDeviceId,
  setAudioInputDevices,
  setAudioOutputDevices,
  setVideoInputDeviceId,
  setVideoInputDevices,
} from 'features/Settings/slice'

const log = logger('onboarding/request-access')

interface Props {
  done: () => void
  back?: () => void
}

interface Access {
  audio: boolean
  video: boolean
  screen?: boolean
}

export function RequestAccess(props: Props) {
  const dispatch = useDispatch()
  // const [] = useSelector((state) => [])
  const [accessStatus, setAccessStatus] = useState<Access>({
    audio: false,
    video: false,
  })
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!accessStatus.video || !accessStatus.audio) return

    getUserDevices()
      .then((userDevices) => {
        log.info('User devices', userDevices)

        dispatch(setVideoInputDevices(userDevices.cameras))
        dispatch(setAudioInputDevices(userDevices.mics))
        dispatch(setAudioOutputDevices(userDevices.speakers))

        if (userDevices.cameras.length === 0) {
          setError(new Error('No cameras found'))
          setAccessStatus((status) => ({ ...status, video: false }))
        }

        if (userDevices.mics.length === 0) {
          setError(new Error('No mics found'))
          setAccessStatus((status) => ({ ...status, audio: false }))
        }

        if (userDevices.speakers.length === 0) {
          setError(new Error('No speakers found'))
        }

        getDefaultDevices()
          .then(({ camera, mic }) => {
            if (camera) dispatch(setVideoInputDeviceId(camera))
            if (mic) dispatch(setAudioInputDeviceId(mic))
          })
          .catch((err) => {
            log.error('Unable to find out default devices', err)

            if (userDevices.cameras.length > 0)
              dispatch(setVideoInputDeviceId(userDevices.cameras[0].id))

            if (userDevices.mics.length > 0)
              dispatch(setVideoInputDeviceId(userDevices.mics[0].id))
          })
      })
      .catch((err) => {
        log.error('Can not get user devices', err)
        setError(err)
      })
  }, [accessStatus.video && accessStatus.audio])

  useEffect(() => {
    if (!navigator.permissions) return

    let videoStatus: PermissionStatus | undefined
    let audioStatus: PermissionStatus | undefined

    navigator.permissions
      .query({
        // @ts-ignore
        name: 'camera',
      })
      .then((status) => {
        videoStatus = status
        videoStatus.addEventListener('change', onVideoStatusChange, false)

        setAccessStatus((current) => ({
          ...current,
          video: status.state === 'granted',
        }))
      })

    navigator.permissions
      .query({
        // @ts-ignore
        name: 'microphone',
      })
      .then((status) => {
        audioStatus = status
        audioStatus.addEventListener('change', onAudioStatusChange, false)

        setAccessStatus((current) => ({
          ...current,
          audio: status.state === 'granted',
        }))
      })

    return () => {
      if (videoStatus)
        videoStatus.removeEventListener('change', onVideoStatusChange)
      if (audioStatus)
        audioStatus.removeEventListener('change', onAudioStatusChange)
    }

    function onVideoStatusChange() {
      navigator.permissions
        .query({
          // @ts-ignore
          name: 'camera',
        })
        .then((status) => {
          log.info('camera changed', status)

          setAccessStatus((current) => ({
            ...current,
            video: status.state === 'granted',
          }))
        })
    }

    function onAudioStatusChange() {
      navigator.permissions
        .query({
          // @ts-ignore
          name: 'microphone',
        })
        .then((status) => {
          log.info('audio changed', status)
          setAccessStatus((current) => ({
            ...current,
            audio: status.state === 'granted',
          }))
        })
    }
  }, [])

  return (
    <StepGrid>
      <StepSection>
        <StepContent>
          <CurrentStep />
          <StepTitle>Let{`'`}s get started</StepTitle>
          <StepDesc>
            We need access to your camera and microphone. Rest assured, Sway
            disconnects completely when not in use, saving your device{`'`}s
            resources.
          </StepDesc>
        </StepContent>
        <OnboardingButtonset
          done={
            accessStatus.audio && accessStatus.video
              ? done
              : requestVideoAndMicAccess
          }
          back={props.back}
          label={
            accessStatus.audio && accessStatus.video
              ? 'Next'
              : 'Enable Camera & Microphone'
          }
        />
      </StepSection>
      <StepSection fill>
        <Devices>
          <Device
            label="Camera"
            enabled={accessStatus.video}
            onClick={() => requestVideoAccess()}
          />
          <Device
            label="Microphone"
            enabled={accessStatus.audio}
            onClick={() => requestAudioAccess()}
          />
          {error ? (
            <ErrorMessage>
              👾 Oops, something went wrong; {error.message}.<br />
              <br />
              If you{`'`}re on Safari, either{' '}
              <a href="https://downloads.sway.so/mac">download Mac app</a> or
              switch to Chrome.
            </ErrorMessage>
          ) : null}
        </Devices>
      </StepSection>
    </StepGrid>
  )

  function done() {
    requestVideoAndMicAccess()
  }

  function requestVideoAndMicAccess() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: {
            min: 640,
            ideal: 1280,
            max: 1920,
          },
        },
      })
      .then(() => {
        setAccessStatus((current) => ({ ...current, video: true, audio: true }))
      })
      .catch((err) => {
        setError(err)
      })
  }

  async function requestVideoAccess() {
    log.info('Request video access', 123)
    const constraints = {
      audio: false,
      video: {
        aspectRatio: { min: 1.77 },
        width: { ideal: 1280, max: 1280 },
        height: { ideal: 720, max: 720 },
      },
    }

    try {
      await navigator.mediaDevices.getUserMedia(constraints)
      setAccessStatus((current) => ({ ...current, video: true }))
    } catch (err) {
      setError(err)
      setAccessStatus((current) => ({ ...current, video: false }))
    }
  }

  async function requestAudioAccess() {
    try {
      log.info('Request audio access')
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setAccessStatus((current) => ({ ...current, audio: true }))
    } catch (err) {
      setError(err)
      setAccessStatus((current) => ({ ...current, audio: false }))
    }
  }
}

const Devices = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  height: '100%',
  justifyContent: 'center',
})

const ErrorMessage = styled('div', {
  color: '$red',
  fontSize: '$small',
  textAlign: 'center',
  marginTop: '8px',
})
