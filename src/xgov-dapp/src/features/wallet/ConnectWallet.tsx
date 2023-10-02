import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { PROVIDER_ID, useWallet } from '@makerx/use-wallet'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import api from '../../shared/api'
import { Loading } from '../../shared/loading/Loading'
import { useSetShowConnectWalletModal, useShowConnectWalletModal } from './state'

const ConnectWallet = () => {
  const [connecting, setConnecting] = useState(false)

  const showConnectWalletModal = useShowConnectWalletModal()
  const setShowConnectWalletModal = useSetShowConnectWalletModal()

  const { execute: connectWallet } = api.useConnectWallet()
  const { providers, activeAddress } = useWallet()

  const isExodusInstalled = useMemo(() => {
    return !!providers?.some((p) => p.metadata.id === PROVIDER_ID.EXODUS)
  }, [providers])

  useEffect(() => {
    const reconnect = async () => {
      await Promise.all((providers ?? []).map(async (p) => p.reconnect()))
    }
    reconnect()
  }, [])

  useEffect(() => {
    ;(async () => {
      setConnecting(true)
      await connectWallet(activeAddress ? activeAddress : '')
      setConnecting(false)
    })()
  }, [activeAddress])

  const onClose = () => {
    setShowConnectWalletModal(false)
  }

  const ExodusInstallButton = () => {
    const provider = {
      isActive: false,
      isConnected: false,
      metadata: {
        id: 'exodus',
        name: 'Exodus',
        icon:
          'data:image/svg+xml;base64,' +
          'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjUuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMDAgMzAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6dXJsKCNTVkdJRF8xXyk7fQoJLnN0MXtmaWxsOnVybCgjU1ZHSURfMDAwMDAwNDM0MjYxNjcxNDAxMDY1ODIyNzAwMDAwMDIxMzA3Njg5MDYwNzMxMTM0ODRfKTt9Cgkuc3Qye2ZpbGw6dXJsKCNTVkdJRF8wMDAwMDEwMjUxOTMxNjAxNTI3NjU4MTY0MDAwMDAxNjI3NDExMjM4MzE3NTY0MTc1OV8pO2ZpbHRlcjp1cmwoI0Fkb2JlX09wYWNpdHlNYXNrRmlsdGVyKTt9Cgkuc3Qze2ZpbGw6dXJsKCNTVkdJRF8wMDAwMDEzODU2MzM4MjQ2MjA4NjAyMDM1MDAwMDAxNDg3ODQ5MDI3MDc4MjA3MTIwN18pO30KCS5zdDR7bWFzazp1cmwoI21hc2swXzE2NjFfMjk1XzAwMDAwMDg4MTMyMjUxNTk3NDQxNTczNDkwMDAwMDExNjkzNjEyMDE4NTA2NjgxNDgxXyk7fQoJLnN0NXtmaWxsOnVybCgjU1ZHSURfMDAwMDAxMDYxMjA2MzI0NjE3OTI4NzExNjAwMDAwMDc0MzM5MTMwMzgzMzc3NjY1NzZfKTt9Cjwvc3R5bGU+CjxnPgoJCgkJPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIyNDYuNjAzIiB5MT0iOS4yMjEyIiB4Mj0iMTc0LjE1OCIgeTI9IjMwOC41NDI2IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgMzAyKSI+CgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzBCNDZGOSIvPgoJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNCQkZCRTAiLz4KCTwvbGluZWFyR3JhZGllbnQ+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjc0LjcsOTMuOUwxNjYuNiwyM3YzOS42bDY5LjQsNDUuMWwtOC4yLDI1LjhoLTYxLjJ2MzIuOWg2MS4ybDguMiwyNS44bC02OS40LDQ1LjFWMjc3bDEwOC4yLTcwLjdMMjU3LDE1MC4xCgkJTDI3NC43LDkzLjl6Ii8+CgkKCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzAwMDAwMDE4MjI4MjM3MTUxMjM5MTUxMzIwMDAwMDE3ODM4NjY0MjU5NzY2MjczOTI1XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxMjkuMzUxNiIgeTE9Ii0xOS4xNTczIiB4Mj0iNTYuOTA2NiIgeTI9IjI4MC4xNjQxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgMzAyKSI+CgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzBCNDZGOSIvPgoJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNCQkZCRTAiLz4KCTwvbGluZWFyR3JhZGllbnQ+Cgk8cGF0aCBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzAwMDAwMDE4MjI4MjM3MTUxMjM5MTUxMzIwMDAwMDE3ODM4NjY0MjU5NzY2MjczOTI1Xyk7IiBkPSJNNzIuNSwxNjYuNGg2MXYtMzIuOUg3Mi4ybC03LjktMjUuOAoJCWw2OS4yLTQ1LjFWMjNMMjUuMyw5My45TDQzLDE1MC4xbC0xNy43LDU2LjJMMTMzLjcsMjc3di0zOS42bC02OS40LTQ1LjFMNzIuNSwxNjYuNHoiLz4KCTxkZWZzPgoJCTxmaWx0ZXIgaWQ9IkFkb2JlX09wYWNpdHlNYXNrRmlsdGVyIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjI1LjQiIHk9IjIzIiB3aWR0aD0iMjQ3LjYiIGhlaWdodD0iMjU0Ij4KCQkJPGZlQ29sb3JNYXRyaXggIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIxIDAgMCAwIDAgIDAgMSAwIDAgMCAgMCAwIDEgMCAwICAwIDAgMCAxIDAiLz4KCQk8L2ZpbHRlcj4KCTwvZGVmcz4KCQoJCTxtYXNrIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjI1LjQiIHk9IjIzIiB3aWR0aD0iMjQ3LjYiIGhlaWdodD0iMjU0IiBpZD0ibWFzazBfMTY2MV8yOTVfMDAwMDAwODgxMzIyNTE1OTc0NDE1NzM0OTAwMDAwMTE2OTM2MTIwMTg1MDY2ODE0ODFfIj4KCQkKCQkJPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8wMDAwMDE2NTkyOTcyNDMwMzE2NDIwMzAwMDAwMDAwNzEwMTkwNDk4NDUxOTkxNTE2Ml8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMjQ2LjYwMzgiIHkxPSI5LjIyMTQiIHgyPSIxNzQuMTU4OCIgeTI9IjMwOC41NDI4IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgMzAyKSI+CgkJCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwQjQ2RjkiLz4KCQkJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I0JCRkJFMCIvPgoJCTwvbGluZWFyR3JhZGllbnQ+CgkJPHBhdGggc3R5bGU9ImZpbGw6dXJsKCNTVkdJRF8wMDAwMDE2NTkyOTcyNDMwMzE2NDIwMzAwMDAwMDAwNzEwMTkwNDk4NDUxOTkxNTE2Ml8pO2ZpbHRlcjp1cmwoI0Fkb2JlX09wYWNpdHlNYXNrRmlsdGVyKTsiIGQ9IgoJCQlNMjc0LjcsOTMuOUwxNjYuNiwyM3YzOS42bDY5LjQsNDUuMWwtOC4yLDI1LjhoLTYxLjJ2MzIuOWg2MS4ybDguMiwyNS44bC02OS40LDQ1LjFWMjc3bDEwOC4yLTcwLjdMMjU3LDE1MC4xTDI3NC43LDkzLjl6Ii8+CgkJCgkJCTxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMDAwMDAxMTk4MTE3MDc2MjE0NzI4MTQyNzAwMDAwMTA4Mjk2NTkzODM4NTEyMDI0OTFfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjEyOS4zNTIxIiB5MT0iLTE5LjE1NzEiIHgyPSI1Ni45MDcxIiB5Mj0iMjgwLjE2NDIiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCAzMDIpIj4KCQkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzBCNDZGOSIvPgoJCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojQkJGQkUwIi8+CgkJPC9saW5lYXJHcmFkaWVudD4KCQk8cGF0aCBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzAwMDAwMTE5ODExNzA3NjIxNDcyODE0MjcwMDAwMDEwODI5NjU5MzgzODUxMjAyNDkxXyk7IiBkPSJNNzIuNSwxNjYuNGg2MXYtMzIuOUg3Mi4ybC03LjktMjUuOAoJCQlsNjkuMi00NS4xVjIzTDI1LjMsOTMuOUw0MywxNTAuMWwtMTcuNyw1Ni4yTDEzMy43LDI3N3YtMzkuNmwtNjkuNC00NS4xTDcyLjUsMTY2LjR6Ii8+Cgk8L21hc2s+Cgk8ZyBjbGFzcz0ic3Q0Ij4KCQkKCQkJPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8wMDAwMDEwOTAxOTkxODU1Nzc3MzA1MzQyMDAwMDAxNzYwMjQwNTkwODA2NzEyMDMwMF8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iNDYuNDY2MiIgeTE9IjIyOC43NTU0IiB4Mj0iMTcxLjg2MzgiIHkyPSIxMzUuMTAzOSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDMwMikiPgoJCQk8c3RvcCAgb2Zmc2V0PSIwLjExOTgiIHN0eWxlPSJzdG9wLWNvbG9yOiM4OTUyRkY7c3RvcC1vcGFjaXR5OjAuODciLz4KCQkJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I0RBQkRGRjtzdG9wLW9wYWNpdHk6MCIvPgoJCTwvbGluZWFyR3JhZGllbnQ+CgkJCgkJCTxyZWN0IHg9IjI1LjQiIHk9IjIzIiBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzAwMDAwMTA5MDE5OTE4NTU3NzczMDUzNDIwMDAwMDE3NjAyNDA1OTA4MDY3MTIwMzAwXyk7IiB3aWR0aD0iMjQ3LjYiIGhlaWdodD0iMjU0Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==',
      },
    }
    return (
      <Button
        key={`provider-${provider.metadata.id}`}
        className="p-4"
        variant="outlined"
        color="primary"
        endIcon=""
        onClick={() => {
          window.open('https://www.exodus.com/install-forwarder/extension/', '_blank')
        }}
      >
        <img width={30} height={30} alt="" src={provider.metadata.icon} className="mr-2 flex-shrink" />
        <span className="flex-1">{provider.metadata.name}</span>
      </Button>
    )
  }

  return (
    <Dialog open={showConnectWalletModal} onClose={onClose}>
      <DialogTitle>{connecting ? 'Connecting wallet... ' : 'Select a wallet'}</DialogTitle>
      <DialogContent>
        {connecting ? (
          <Loading />
        ) : (
          <Stack spacing={2}>
            <div>
              <Typography>Select the wallet that you will use to sign your transactions.</Typography>
            </div>
            {(activeAddress || providers?.find((p) => p.isActive)) && (
              <>
                <Typography>Selected account</Typography>
                <p className="text-left">
                  <strong>
                    <code className="break-words">{activeAddress}</code>
                  </strong>
                </p>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    providers?.find((p) => p.isActive)?.disconnect()
                  }}
                >
                  Disconnect
                </Button>
              </>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 justify-items-stretch gap-4">
              {providers?.map((provider) => (
                <Button
                  key={`provider-${provider.metadata.id}`}
                  className="p-4"
                  variant="outlined"
                  color="primary"
                  // startIcon={<img width={30} height={30} alt="" src={provider.metadata.icon} className="mr-2 flex-shrink" />}
                  endIcon={provider.isActive ? <CheckCircleIcon height={30} width={30} /> : ''}
                  onClick={() => {
                    return provider.isConnected ? provider.setActiveProvider() : provider.connect()
                  }}
                >
                  <img width={30} height={30} alt="" src={provider.metadata.icon} className="mr-2 flex-shrink" />
                  <span className="flex-1">{provider.metadata.name}</span>
                </Button>
              ))}
              {!isExodusInstalled && <ExodusInstallButton />}
            </div>
          </Stack>
        )}
      </DialogContent>
      {!connecting && (
        <DialogActions>
          <Button onClick={onClose} className="mr-1">
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
export default ConnectWallet
