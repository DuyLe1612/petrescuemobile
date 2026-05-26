import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.warn("Must use physical device for Push Notifications");
  }
  return token;
}

export async function sendTokenToServer(token: string, jwt: string) {
  try {
    await fetch("http://localhost:8080/api/v1/users/me/push-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ expoPushToken: token }),
    });
  } catch (e) {
    console.warn("Failed to send push token to server", e);
  }
}
