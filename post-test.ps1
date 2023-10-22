Get-ChildItem -Recurse -Include *.mjs | ForEach-Object {
  $content = Get-Content $_.FullName
  $updatedContent = $content -replace "../../../layers/services-utils", "../../opt"
  Set-Content $_.FullName $updatedContent
}
