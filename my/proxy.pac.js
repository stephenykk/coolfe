function FindProxyForURL(url, host) {
  if (shExpMatch(url, "*yunxuetang*") {
       return "PROXY 192.168.0.102:8888; DIRECT";
  }

  return "DIRECT";
}
