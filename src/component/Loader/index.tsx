import { Dialog, DialogContent } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export function Loader({open = false}: {open: boolean}) {
    return (
        <Dialog open={open}>
            <DialogContent sx={{display:'flex', flexDirection: 'column'}}>
                <div className="text-center">
                    <CircularProgress />
                </div>
            </DialogContent>
        </Dialog>
    )
}