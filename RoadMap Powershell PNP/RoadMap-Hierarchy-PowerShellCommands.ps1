$credential = Get-Credential
$siteUrl = "https://office4.bt.com/sites/IT Reporting"
Connect-PnPOnline -url $siteUrl -Credentials $credential
New-PnPGroup -Title "Directors"
Add-PnPUserToGroup -LoginName kirankumar.kanakanti@bt.com -Identity 'Directors'
$Director_Field = '<Field Type="User" DisplayName="Director" StaticName="Director" Name="Director" Description="" -Group "Roadmap Site Columns" Required="TRUE" ID="{'+[guid]::NewGuid().ToString()+'}" ShowField="Name (with presence)" UserSelectionMode="PeopleOnly"/>'
Add-PnPFieldFromXml -FieldXml $Director_Field
$Manager_Field = '<Field Type="User" DisplayName="Manager" StaticName="Manager" Name="Manager" Description="" -Group "Roadmap Site Columns" Required="TRUE" ID="{'+[guid]::NewGuid().ToString()+'}" ShowField="Name (with presence)" UserSelectionMode="PeopleOnly"/>'
Add-PnPFieldFromXml -FieldXml $Manager_Field
$TeamLead_Field = '<Field Type="User" DisplayName="TeamLead" StaticName="TeamLead" Name="TeamLead" Description="" -Group "Roadmap Site Columns" Required="TRUE" ID="{'+[guid]::NewGuid().ToString()+'}" ShowField="Name (with presence)" UserSelectionMode="PeopleOnly"/>'
Add-PnPFieldFromXml -FieldXml $TeamLead_Field
$TeamMember_Field = '<Field Type="User" DisplayName="TeamMember" StaticName="TeamMember" Name="TeamMember" Description="" -Group "Roadmap Site Columns" Required="TRUE" ID="{'+[guid]::NewGuid().ToString()+'}" ShowField="Name (with presence)" UserSelectionMode="PeopleOnly"/>'
Add-PnPFieldFromXml -FieldXml $TeamMember_Field