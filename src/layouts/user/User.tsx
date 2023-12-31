import {
    Box, Button, FormControl,
    Grid, IconButton,
    InputBase, InputLabel, MenuItem, OutlinedInput, Pagination,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {IDistrictResponse, IProvinceResponse, IUserResponse, IWardResponse} from "../../interface/response";
import UserRowItem from "../../components/user/UserRowItem";
import {Search} from "@mui/icons-material";
import {useEffect, useState} from "react";
import service from "../../service";
import AppToast from "../../utils/AppToast";
import {IUserAllQuery} from "../../interface/request";

const componentStyle = {
    padding: 24,
}

const fontTitle = {
    fontSize: '16px',
    fontWeight: 700,
    color: 'rgba(0,0,0,0.9)'
}

const table = {
    borderRadius: 10,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
}

const searchComponent = {
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0px 2px 2px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    borderRadius: 6,
    padding: '2px 4px',
}

const searchInputStyle = {
    marginLeft: 1,
    flex: 1,
}

const searchIconStyle = {
    padding: 10
}


const SelectStyle = {
    minWidth: '240px',
    maxWidth: '240px',
    maxHeight: '300px',
}

const User = () => {
    const [users, setUsers] = useState<Array<IUserResponse>>([])
    const [total, setTotal] = useState<number>(0)

    const [provinces, setProvinces] = useState<Array<IProvinceResponse>>([])
    const [districts, setDistricts] = useState<Array<IDistrictResponse>>([])
    const [wards, setWard] = useState<Array<IWardResponse>>([])

    const fetchProvinces = async () => {
        const res = await service.location.getProvinces()
        if (res instanceof Error) {
            return AppToast({message: res.message, isSuccess: false})
        }

        setProvinces(res.provinces)
    }

    const fetchDistricts = async (provinceId: string) => {
        const res = await service.location.getDistricts(provinceId)
        if (res instanceof Error) {
            return AppToast({message: res.message, isSuccess: false})
        }

        setDistricts(res.districts)
    }

    const fetchWards = async (districtId: string) => {
        const res = await service.location.getWards(districtId)
        if (res instanceof Error) {
            return AppToast({message: res.message, isSuccess: false})
        }

        setWard(res.wards)
    }

    const fetchUser = async (page:number) => {
        const res = await service.user.allUser({
            page: page,
            provinceId: selectedProvince,
            districtId: selectedDistrict,
            wardId: selectedWard,
        } as IUserAllQuery)
        if (res instanceof Error) {
            return AppToast({message: res.message, isSuccess: false})
        }

        setTotal(res.total)
        setUsers(res.users)
    }

    useEffect(() => {
        fetchProvinces().then()
        fetchUser(0).then()
    }, [])


    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    const handleProvinceChange = (event: any) => {
        if(!event.target.value){

            setSelectedProvince("")
            setSelectedDistrict("")
            setSelectedWard('')
            return
        }
            setWard([])
            setSelectedProvince(event.target.value);
            fetchDistricts(event.target.value).then();
    };
    const handleDistrictChange = (event: any) => {
            setSelectedDistrict(event.target.value);
            fetchWards(event.target.value).then();

    };
    const handleWardChange = (event: any) => {
            setSelectedWard(event.target.value);

    };
    return (
        <div>
            <Box style={componentStyle}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={2} md={2} style={{margin: '0px auto', backgroundColor: 'white',}}>
                        <div style={{position: 'fixed',width:'10%'}}>
                            <Box style={SelectStyle}>
                                <Typography variant={'h6'}> Tìm kiếm</Typography>
                                <Paper style={searchComponent}>
                                    <InputBase
                                        style={searchInputStyle}
                                        placeholder="nhập sđt, email"
                                        inputProps={{'aria-label': 'search'}}
                                    />
                                    <IconButton style={searchIconStyle} aria-label="search">
                                        <Search/>
                                    </IconButton>
                                </Paper>
                            </Box>
                            <Box>
                                <Grid >
                                    <FormControl sx={{maxWidth: '100%', width: "100%", marginTop: 4}}>
                                        <InputLabel id="demo-single-name-label">Thành phố</InputLabel>
                                        <Select
                                            sx={SelectStyle}
                                            labelId="demo-single-name-label"
                                            id="demo-single-name"
                                            value={selectedProvince}
                                            onChange={handleProvinceChange}
                                            input={<OutlinedInput label="Name"/>}
                                        >
                                            <MenuItem value="">-- Không chọn --</MenuItem>
                                            {provinces.map((province) => (
                                                <MenuItem key={province.id} value={province.id}>
                                                    {province.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{maxWidth: '100%', width: "100%", marginTop: 4}}>
                                        <InputLabel id="demo-single-name-label">Quận/Huyện</InputLabel>
                                        <Select
                                            sx={SelectStyle}
                                            labelId="demo-single-name-label"
                                            id="demo-single-name"
                                            value={selectedDistrict}
                                            onChange={handleDistrictChange}
                                            input={<OutlinedInput label="Name"/>}
                                        >
                                            <MenuItem value="">-- Không chọn --</MenuItem>
                                            {districts.map((district) => (
                                                <MenuItem key={district.id} value={district.id}>
                                                    {district.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{maxWidth: '100%', width: "100%", marginTop: 4}}>
                                        <InputLabel id="demo-single-name-label">Phường/Xã</InputLabel>
                                        <Select
                                            sx={SelectStyle}
                                            labelId="demo-single-name-label"
                                            id="demo-single-name"
                                            value={selectedWard}
                                            onChange={handleWardChange}
                                            input={<OutlinedInput label="Name"/>}
                                        >
                                            <MenuItem value="">-- Không chọn --</MenuItem>
                                            {wards.map((ward) => (
                                                <MenuItem key={ward.id} value={ward.id}>
                                                    {ward.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button style={{marginTop:4}} onClick={()=>{
                                        fetchUser(0).then()
                                    }} variant={"contained"} >Lọc</Button>
                                </Grid>
                            </Box>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={10} md={10}>
                        <Paper style={table}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={fontTitle}>ID</TableCell>
                                        <TableCell style={fontTitle}>Người dùng</TableCell>
                                        <TableCell style={fontTitle}>Số điện thoại</TableCell>
                                        <TableCell style={fontTitle}>Email</TableCell>
                                        <TableCell align={'center'} style={fontTitle}>Xem chi tiết</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((e) => {
                                        return <UserRowItem user={e}/>
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                        <div style={{marginTop:12, display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <Pagination count={Math.floor(total/20)+1} color="primary"/>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default User;