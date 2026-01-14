<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Footer PDF</title>

    <style>
      body {
        font-family: DejaVu Sans, sans-serif;
        font-size: 12px;
        color: #000;
      }
      .container {
        width: 100%;
        padding: 10px;
      }
      .footer {
        width: 100%;
        border-top: 1px solid #000;
        padding-top: 10px;
      }
    </style>
</head>
<body>
  <div class="container">

    {{-- Footer content --}}
    <div class="footer">
      <table width="100%">
        <tr>
          <td width="30%">
            <img src="{{ public_path('companies/insurance-services.png') }}" height="30">
          </td>

          <td width="40%" style="text-align:center;">
            Desarrollado por <strong>Insurance Services</strong> V1.0
          </td>

          <td width="30%"></td>
        </tr>
      </table>
    </div>

  </div>
</body>
</html>