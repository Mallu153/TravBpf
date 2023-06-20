export class AccountPermissions {
  SNO?: number;
  PermissionName: string;
  PermissionKey: string;
  Description: string;
  PermissionGroupName: string;
  PermissionOrder: string;
  roles: string;
}
export class AccountRole {
  SNO?: number;
  RoleName: string;
  RoleKey: string;
  Status: string;
}
export class AccountRegister {
  SNO?: string;
  UserName: string;
  Password: string;
  EmailID: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Supervisor: string;
  ValidFrom: Date;
  ValidTo: Date;
  Status: string;
  organizationId: number;
}
export class PermissionRoleRelation {
  SNO?: number;
  ROLEID: string;
  PERMISSIONID: string;
}

export class UserRoleMapping {
  SNO?: number;
  Users: string;
  Roles: string;
}
export class RolePermissionMapping {
  SNO?: number;
  Roles: string;
  Permissions: string;
}
