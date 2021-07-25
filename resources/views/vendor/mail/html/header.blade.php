<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'CodeBooth')
<img src="https://res.cloudinary.com/oluwatobi/image/upload/c_crop,h_200,w_250/v1626728708/codebooth/CodeBooth_Logo_-_Trans_bg_eqq4za.png" width="140" height="120" alt="CodeBooth">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
