set -e
getDockerComposeFile() {
  curl -sSL https://raw.githubusercontent.com/bitnami/bitnami-docker-rabbitmq/master/docker-compose.yml >docker-compose.yml
}
createVolume() {
  mkdir volume
  sudo chmod 777 volume
}
$1
