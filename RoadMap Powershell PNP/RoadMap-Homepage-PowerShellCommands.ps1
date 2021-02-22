$credential = Get-Credential
$siteUrl = "https://office4.bt.com/sites/IT Reporting"
Connect-PnPOnline -url $siteUrl -Credentials $credential

$listUsefulLinks = "UsefulLinks"
New-PnPList -Title $listUsefulLinks -Url $listUsefulLinks -Template GenericList -EnableVersioning
Set-PnPList -Identity "UsefulLinks" -Title "Useful Links"

$listTaskProgress = "TaskProgress"
New-PnPList -Title $listTaskProgress -Url $listTaskProgress -Template GenericList -EnableVersioning
Set-PnPList -Identity "TaskProgress" -Title "Task Progress"
Set-PnPField -List "TaskProgress" -Identity "Title" -Values @{Title="Country"}

Add-PnPContentType -Name "Task Progress" -Description "Roadmap Task Progress" -Group "Task Progress" -ParentContentType $ct
$percentField = Add-PnPField -DisplayName "Percent" -InternalName "Percent" -Type Text
Add-PnPFieldToContentType -Field $percentField -ContentType "Task Progress"
$progressTitleField = Add-PnPField -DisplayName "Task Progress Title" -InternalName "progressTitle" -Type Choice -AddToDefaultView -Choices "IP Cost breakdown Chart","Current User Tasks Chart"
Add-PnPFieldToContentType -Field $progressTitleField -ContentType "Task Progress"
Add-PnPContentTypeToList -List "TaskProgress" -ContentType "Task Progress" -DefaultContentType
Set-PnPView -List "TaskProgress" -Identity "All Items" -Fields "Country","Percent", "Task Progress Title"