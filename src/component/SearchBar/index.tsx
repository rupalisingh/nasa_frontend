import {
  TextField,
  Autocomplete,
  Button,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  FormControl,
  DialogActions,
} from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import TuneIcon from "@mui/icons-material/Tune";

type SearchBarProps = {
  options: {
    title: string;
    id: number;
  }[];
};

export function SearchBar({ options = [] }: SearchBarProps) {
  const [value, setValue] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("7");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    if (value) {
      const option = options.find((item) => item.title === value);
      if (option) {
        navigate(
          `/list-events?categoryId=${option.id}&category=${option.title}&duration=${duration}`
        );
      }
    }
  }, [value, options, duration, navigate]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSearch();
    },
    [handleSearch]
  );

  const handleClose = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const searchOptions = useMemo(() => options.map((option) => option.title), [options]);

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="w-full flex space-x-2">
        <Autocomplete
          freeSolo
          fullWidth
          id="search-bar"
          disableClearable
          value={value ?? ""}
          onChange={(event: any, newValue: string | null) => setValue(newValue)}
          options={searchOptions}
          renderInput={(params: any) => (
            <TextField
              {...params}
              label="Search"
              placeholder="Severe Storms"
              slotProps={{
                input: {
                  ...params.InputProps,
                  type: "search",
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" sx={{ color: "white" }}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& label.Mui-focused": { color: "white" },
                input: { color: "white" },
                label: { color: "white" },
              }}
            />
          )}
        />

        <div className="flex items-center">
          <Button onClick={() => setOpenDialog(true)}>
            <TuneIcon sx={{ color: "white" }} />
          </Button>

          <Dialog disableEscapeKeyDown open={openDialog} onClose={handleClose}>
            <DialogTitle>Select Duration</DialogTitle>
            <DialogContent sx={{ marginBottom: 0.5 }}>
              <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    id="select-duration"
                    value={duration}
                    onChange={(event: SelectChangeEvent) =>
                      setDuration(event.target.value)
                    }
                    displayEmpty
                  >
                    <MenuItem value={"7"}>Past 7 days</MenuItem>
                    <MenuItem value={"15"}>Past 15 days</MenuItem>
                    <MenuItem value={"30"}>Past 30 days</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center", marginBottom: 1 }}>
              <Button
                onClick={() => {
                  handleSearch();
                  handleClose();
                }}
                variant="outlined"
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </form>
  );
}
