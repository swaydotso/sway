defmodule SwayWeb.AppController do
  use SwayWeb, :controller
  alias Sway.Guardian

  def index(conn, params) do
    user_id = conn.assigns.current_user.id

    [workspace, membership] = Sway.Workspaces.get_membership_and_workspace(user_id, params["workspace"])
    [rooms, status, privateRooms] = fetchRoomData(workspace.id, user_id)

    {:ok, jwt, _claims} = Guardian.encode_and_sign(conn.assigns.current_user, %{})

    render(conn, "app_home.html",
      jwt: jwt,
      user: conn.assigns.current_user,
      membership: membership,
      workspace: workspace,
      status: status,
      rooms: rooms,
      privateRooms: privateRooms,
      body_class: "app",
    )
  end

  def room(conn, %{ "workspace" => workspace, "room" => room }) do
    user_id = conn.assigns.current_user.id

    [workspace, membership] = Sway.Workspaces.get_membership_and_workspace(user_id, workspace)
    [rooms, status, privateRooms] = fetchRoomData(workspace.id, user_id)

     {:ok, jwt, _claims} = Guardian.encode_and_sign(conn.assigns.current_user, %{})

    focusedRoom = Enum.find(rooms, fn el ->
      el.slug == room
    end)

    # FIXME:
    # Change the room
    render(conn, "app_home.html",
      user: conn.assigns.current_user,
      membership: membership,
      workspace: workspace,
      status: status,
      rooms: rooms,
      privateRooms: privateRooms,
      body_class: "app",
      jwt: jwt,
      fake_state: false,
    )
  end

  defp fetchRoomData(workspace_id, user_id) do
    rooms = Sway.Rooms.list_by_workspace_id(workspace_id)
    status = Sway.Statuses.get_latest_status(user_id, workspace_id)
    privateRooms = Sway.Rooms.list_private_rooms_by_user_id(workspace_id, user_id)
    [rooms, status, privateRooms]
  end
end
