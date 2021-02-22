<# Start-Transcript
Set-ExecutionPolicy RemoteSigned
Get-ExecutionPolicy
Install-Module SharePointPnPPowerShellOnline -AllowClobber #>
$credential = Get-Credential
$siteUrl = "https://office4.bt.com/sites/IT Reporting"
$listName = "RoadmapTaskView"
Connect-PnPOnline -url $siteUrl -Credentials $credential
New-PnPList -Title $listName -Url $listName -Template GenericList -EnableVersioning
Set-PnPList -Identity "RoadmapTaskView" -Title "Task List"

Set-PnPField -List "RoadmapTaskView" -Identity "Title" -Values @{Title="Demand"}

Add-PnPContentType -Name "RM Task List" -Description "Roadmap Task List" -Group "RM Task List" -ParentContentType $ct

$costField = Add-PnPField -DisplayName "Cost" -InternalName "Cost" -Type Currency
Add-PnPFieldToContentType -Field $costField -ContentType 'RM Task List'

$ownerField = Add-PnPField -DisplayName "Owner" -InternalName "Owner" -Type User
Add-PnPFieldToContentType -Field $ownerField -ContentType 'RM Task List'

$StartDtField = Add-PnPField -DisplayName "Start Date" -InternalName "StartDateTime" -Type DateTime
Add-PnPFieldToContentType -Field $StartDtField -ContentType 'RM Task List'

$EndDtField = Add-PnPField -DisplayName "End Date" -InternalName "EndDateTime" -Type DateTime
Add-PnPFieldToContentType -Field $EndDtField -ContentType 'RM Task List'

Add-PnPContentTypeToList -List "RoadmapTaskView" -ContentType "RM Task List" -DefaultContentType

<#Add-PnPView -List "RoadmapTaskView" -Title "ganttTaskView" -Fields "Title","Owner", "Cost", "Start Date", "End Date" -ViewType html#>
Set-PnPView -List "RoadmapTaskView" -Identity "All Items" -Fields "Title","Owner", "Cost", "Start Date", "End Date"
