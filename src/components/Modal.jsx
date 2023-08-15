import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

function Modal({ onClose, open, children }) {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{children}</DialogTitle>
      <List>
        <ListItem>
          <ListItemButton
            onClick={() => onClose(true)}
            sx={{
              backgroundColor: "#ef4444",
              ":hover": {
                backgroundColor: "#b91c1c",
              },
            }}
          >
            <ListItemText primary="Confirm" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => onClose(false)}>
            <ListItemText primary="Cancel" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

export default Modal;
