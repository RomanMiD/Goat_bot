import { Role } from "../common/role.enum";


export namespace accessHelper {
    function checkLeadRole(banditRole: Role) {
        return banditRole === Role.CrewLeader || banditRole === Role.Tsar || banditRole === Role.Vice
    }

    function checkSuperRole(banditRole: Role) {
        return banditRole === Role.Tsar
    }
}