import { useState } from "react";
import { Shield, UserCog, Eye, Activity } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

const usersData = [
  {
    id: 1,
    nombre: "Admin Principal",
    correo: "admin@empresa.com",
    rol: "Admin",
    permisos: ["Todo"],
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "María González",
    correo: "maria.g@empresa.com",
    rol: "Cajero",
    permisos: ["Ventas", "Ver Inventario"],
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Carlos Pérez",
    correo: "carlos.p@empresa.com",
    rol: "Cajero",
    permisos: ["Ventas", "Ver Inventario"],
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Ana López",
    correo: "ana.l@empresa.com",
    rol: "Admin",
    permisos: ["Todo"],
    estado: "Inactivo",
  },
];

const auditLogData = [
  {
    id: 1,
    usuario: "Admin Principal",
    accion: "Eliminó producto",
    detalle: 'Producto "Leche Deslactosada 1L" (SKU: LEC-009)',
    fecha: "19 Mar 2026, 14:30",
    tipo: "delete",
  },
  {
    id: 2,
    usuario: "María González",
    accion: "Modificó inventario",
    detalle:
      'Producto "Queso Fresco 500g" - Stock actualizado: 45 unidades',
    fecha: "19 Mar 2026, 13:15",
    tipo: "edit",
  },
  {
    id: 3,
    usuario: "Admin Principal",
    accion: "Creó nuevo cliente",
    detalle:
      'Cliente "Roberto Jiménez" - Tel: +54 11 9517-5328',
    fecha: "19 Mar 2026, 11:45",
    tipo: "create",
  },
  {
    id: 4,
    usuario: "Carlos Pérez",
    accion: "Procesó venta",
    detalle: "Pedido #1247 - Total: $ 450",
    fecha: "19 Mar 2026, 10:30",
    tipo: "sale",
  },
  {
    id: 5,
    usuario: "Admin Principal",
    accion: "Modificó usuario",
    detalle: 'Usuario "Ana López" - Estado cambiado a Inactivo',
    fecha: "18 Mar 2026, 16:20",
    tipo: "edit",
  },
  {
    id: 6,
    usuario: "María González",
    accion: "Eliminó pedido",
    detalle: "Pedido #1240 - Cliente: Juan Herrera",
    fecha: "18 Mar 2026, 15:10",
    tipo: "delete",
  },
  {
    id: 7,
    usuario: "Admin Principal",
    accion: "Importación masiva",
    detalle: "25 productos importados desde Excel",
    fecha: "18 Mar 2026, 09:00",
    tipo: "import",
  },
];

const permissions = [
  { id: "ventas", label: "Gestión de Ventas" },
  { id: "inventario", label: "Gestión de Inventario" },
  { id: "clientes", label: "Gestión de Clientes" },
  { id: "reportes", label: "Ver Reportes" },
  { id: "usuarios", label: "Administrar Usuarios" },
  { id: "config", label: "Configuración del Sistema" },
];

export function Settings() {
  const [adminPermissions, setAdminPermissions] = useState(
    permissions.map((p) => p.id),
  );
  const [cajeroPermissions, setCajeroPermissions] = useState([
    "ventas",
    "clientes",
  ]);

  const togglePermission = (
    role: "admin" | "cajero",
    permissionId: string,
  ) => {
    if (role === "admin") {
      if (adminPermissions.includes(permissionId)) {
        setAdminPermissions(
          adminPermissions.filter((p) => p !== permissionId),
        );
      } else {
        setAdminPermissions([
          ...adminPermissions,
          permissionId,
        ]);
      }
    } else {
      if (cajeroPermissions.includes(permissionId)) {
        setCajeroPermissions(
          cajeroPermissions.filter((p) => p !== permissionId),
        );
      } else {
        setCajeroPermissions([
          ...cajeroPermissions,
          permissionId,
        ]);
      }
    }
  };

  const getActionBadge = (tipo: string) => {
    const variants: Record<
      string,
      { variant: any; label: string }
    > = {
      delete: { variant: "destructive", label: "Eliminación" },
      edit: { variant: "default", label: "Modificación" },
      create: { variant: "default", label: "Creación" },
      sale: { variant: "default", label: "Venta" },
      import: { variant: "default", label: "Importación" },
    };

    const config = variants[tipo] || {
      variant: "secondary",
      label: tipo,
    };

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Configuración y Seguridad
        </h1>
        <p className="text-gray-500 mt-2">
          Gestiona roles de usuario y auditoría del sistema
        </p>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles" className="gap-2">
            <UserCog className="w-4 h-4" />
            Roles de Usuario
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="gap-2">
            <Shield className="w-4 h-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="auditoria" className="gap-2">
            <Activity className="w-4 h-4" />
            Bitácora de Actividad
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Role */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Administrador
                  </h3>
                  <p className="text-sm text-gray-500">
                    Control total del sistema
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Permisos del Rol:
                </p>
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between"
                  >
                    <Label htmlFor={`admin-${permission.id}`}>
                      {permission.label}
                    </Label>
                    <Switch
                      id={`admin-${permission.id}`}
                      checked={adminPermissions.includes(
                        permission.id,
                      )}
                      onCheckedChange={() =>
                        togglePermission("admin", permission.id)
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Cajero Role */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UserCog className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Cajero
                  </h3>
                  <p className="text-sm text-gray-500">
                    Operación de punto de venta
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Permisos del Rol:
                </p>
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between"
                  >
                    <Label htmlFor={`cajero-${permission.id}`}>
                      {permission.label}
                    </Label>
                    <Switch
                      id={`cajero-${permission.id}`}
                      checked={cajeroPermissions.includes(
                        permission.id,
                      )}
                      onCheckedChange={() =>
                        togglePermission(
                          "cajero",
                          permission.id,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>Guardar Cambios</Button>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="usuarios">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">
                  Usuarios del Sistema
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Gestiona los usuarios y sus roles
                </p>
              </div>
              <Button>Agregar Usuario</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.nombre}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {user.correo}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.rol === "Admin"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {user.rol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.permisos
                          .slice(0, 2)
                          .map((permiso, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {permiso}
                            </Badge>
                          ))}
                        {user.permisos.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            +{user.permisos.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.estado === "Activo"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {user.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="auditoria">
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">
                Bitácora de Actividad
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Registro de todas las acciones en el sistema
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Detalle</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogData.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {log.usuario}
                    </TableCell>
                    <TableCell>{log.accion}</TableCell>
                    <TableCell className="max-w-md text-gray-600">
                      {log.detalle}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {log.fecha}
                    </TableCell>
                    <TableCell>
                      {getActionBadge(log.tipo)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}