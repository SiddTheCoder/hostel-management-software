param(
  [string]$MongoUri = $env:MONGODB_URI,
  [string]$OutputRoot = "backups"
)

if (-not $MongoUri) {
  throw "MONGODB_URI or -MongoUri is required."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$target = Join-Path -Path $OutputRoot -ChildPath "mongodb-$timestamp"

New-Item -ItemType Directory -Force -Path $target | Out-Null

mongodump --uri="$MongoUri" --out="$target"

Write-Host "MongoDB backup written to $target"
