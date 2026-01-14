<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recibo de Caja</title>

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

      .header {
        width: 100%;
        border-bottom: 1px solid #000;
        padding-bottom: 10px;
      }

      .header-table {
        width: 100%;
      }

      .header-table td {
        vertical-align: top;
      }

      .logo img {
        width: 140px;
      }

      .empresa {
        text-align: center;
        font-weight: bold;
        font-size: 11px;
      }

      .documento {
        border: 1px solid #000;
        padding: 8px;
        text-align: center;
        font-weight: bold;
      }

      .documento .numero {
        font-size: 16px;
        margin-top: 5px;
      }
    </style>
</head>
<body>

<div class="container">

    {{-- ENCABEZADO --}}
    <div class="header">
      <table class="header-table">
        <tr>
          <td class="logo" width="25%">
            <img src="{{ public_path($company->logo) }}" alt="Logo">
          </td>

          <td class="empresa" width="50%">
            <div>{{ $company->name }}</div>
            <div>NIT {{ $company->document }} - {{ $company->dv }}</div>
            <div>{{ $company->address }}</div>
            <div>Tel. {{ $company->cellphone }}</div>
          </td>

          <td width="25%">
            <div class="documento">
              Documento N°
              <div class="numero">
                RC{{ $numberdocument }}
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
</div>

</body>
</html>
